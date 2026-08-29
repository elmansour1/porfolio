package com.faouzi.portfolio.contact.application.service;

import java.time.Clock;
import java.time.Instant;
import java.util.UUID;

import com.faouzi.portfolio.audit.application.service.ActivityLogService;
import com.faouzi.portfolio.auth.infrastructure.persistence.AdminUserRepository;
import com.faouzi.portfolio.contact.api.dto.request.ContactRequest;
import com.faouzi.portfolio.contact.api.dto.response.ContactMessageAdminDetailResponse;
import com.faouzi.portfolio.contact.api.dto.response.ContactMessageAdminSummaryResponse;
import com.faouzi.portfolio.contact.api.dto.response.ContactMetadataResponse;
import com.faouzi.portfolio.contact.application.mapper.ContactMessageMapper;
import com.faouzi.portfolio.contact.config.ContactProperties;
import com.faouzi.portfolio.contact.domain.model.ContactMessage;
import com.faouzi.portfolio.contact.domain.model.ContactMessageStatus;
import com.faouzi.portfolio.contact.domain.model.ContactRateLimit;
import com.faouzi.portfolio.contact.infrastructure.persistence.ContactMessageRepository;
import com.faouzi.portfolio.contact.infrastructure.persistence.ContactRateLimitRepository;
import com.faouzi.portfolio.profile.domain.model.SiteSettings;
import com.faouzi.portfolio.profile.infrastructure.persistence.SiteSettingsRepository;
import com.faouzi.portfolio.shared.api.dto.response.PageResponse;
import com.faouzi.portfolio.shared.error.ApiException;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ContactApplicationService {

    private static final int DEFAULT_PAGE_SIZE = 20;
    private static final int MAX_PAGE_SIZE = 100;

    private final ContactMessageRepository messages;
    private final ContactRateLimitRepository rateLimits;
    private final SiteSettingsRepository siteSettings;
    private final AdminUserRepository adminUsers;
    private final ActivityLogService activityLog;
    private final ContactNotificationService notificationService;
    private final ContactMessageMapper mapper;
    private final ContactProperties properties;
    private final Clock clock;

    @Transactional(noRollbackFor = ApiException.class)
    public void submit(ContactRequest request, HttpServletRequest httpRequest) {
        String ipAddress = clientIp(httpRequest);
        String userAgent = httpRequest == null ? null : httpRequest.getHeader("User-Agent");

        if (isHoneypotTriggered(request)) {
            activityLog.record(null, "CONTACT_SPAM_HONEYPOT", "contact_message", ipAddress, "IGNORED", httpRequest);
            return;
        }

        Instant now = clock.instant();
        if (ipAddress != null) {
            ContactRateLimit rateLimit = rateLimits.findById(ipAddress)
                    .orElseGet(() -> new ContactRateLimit(ipAddress, now));
            boolean allowed = rateLimit.registerAttempt(
                    properties.rateLimit().maxSubmissions(),
                    properties.rateLimit().window(),
                    now
            );
            rateLimits.save(rateLimit);
            if (!allowed) {
                activityLog.record(null, "CONTACT_RATE_LIMITED", "contact_message", ipAddress, "FAILURE", httpRequest);
                throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, "CONTACT_RATE_LIMITED",
                        "Too many contact requests. Please try again later.");
            }
        }

        ContactMessage message = new ContactMessage(
                UUID.randomUUID(),
                request.name(),
                request.email(),
                request.company(),
                request.requestType(),
                request.subject(),
                request.message(),
                request.consent(),
                ipAddress,
                userAgent,
                now
        );
        messages.save(message);
        activityLog.record(null, "CONTACT_MESSAGE_RECEIVED", "contact_message", message.getId().toString(),
                "SUCCESS", httpRequest);

        SiteSettings settings = currentSettings();
        if (settings != null) {
            notificationService.notifyNewMessage(message, settings.getContactRecipientEmail());
        }
    }

    @Transactional(readOnly = true)
    public PageResponse<ContactMessageAdminSummaryResponse> adminList(ContactMessageStatus status, Integer page, Integer size) {
        Pageable pageable = pageable(page, size);
        Page<ContactMessage> result = status != null
                ? messages.findByStatusOrderByCreatedAtDesc(status, pageable)
                : messages.findAllByOrderByCreatedAtDesc(pageable);
        return PageResponse.of(result.map(mapper::toAdminSummary));
    }

    @Transactional(readOnly = true)
    public ContactMessageAdminDetailResponse adminDetail(UUID id) {
        return mapper.toAdminDetail(requireMessage(id));
    }

    @Transactional(readOnly = true)
    public ContactMetadataResponse metadata() {
        return mapper.metadata();
    }

    @Transactional
    public ContactMessageAdminDetailResponse updateStatus(
            UUID id,
            ContactMessageStatus status,
            Authentication authentication,
            HttpServletRequest httpRequest
    ) {
        ContactMessage message = requireMessage(id);
        message.changeStatus(status, clock.instant());
        record(authentication, "CONTACT_MESSAGE_STATUS_UPDATED", message.getId().toString(), httpRequest);
        return mapper.toAdminDetail(message);
    }

    private boolean isHoneypotTriggered(ContactRequest request) {
        return request.website() != null && !request.website().isBlank();
    }

    private SiteSettings currentSettings() {
        return siteSettings.findAll(Sort.by(Sort.Direction.ASC, "createdAt")).stream()
                .findFirst()
                .orElse(null);
    }

    private ContactMessage requireMessage(UUID id) {
        return messages.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "CONTACT_MESSAGE_NOT_FOUND",
                        "Contact message not found."));
    }

    private Pageable pageable(Integer page, Integer size) {
        int safePage = page == null || page < 0 ? 0 : page;
        int safeSize = size == null || size <= 0 ? DEFAULT_PAGE_SIZE : Math.min(size, MAX_PAGE_SIZE);
        return PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    private String clientIp(HttpServletRequest request) {
        if (request == null) {
            return null;
        }
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private void record(Authentication authentication, String action, String resourceId, HttpServletRequest request) {
        if (authentication == null) {
            return;
        }
        adminUsers.findByEmail(authentication.getName())
                .ifPresent(admin -> activityLog.record(admin, action, "contact_message", resourceId, "SUCCESS", request));
    }
}
