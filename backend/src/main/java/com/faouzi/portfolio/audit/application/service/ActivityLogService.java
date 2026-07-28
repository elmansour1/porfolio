package com.faouzi.portfolio.audit.application.service;

import java.time.Clock;
import java.util.UUID;

import com.faouzi.portfolio.audit.domain.model.ActivityLog;
import com.faouzi.portfolio.audit.infrastructure.persistence.ActivityLogRepository;
import com.faouzi.portfolio.auth.domain.model.AdminUser;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository repository;
    private final Clock clock;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(
            AdminUser adminUser,
            String action,
            String resourceType,
            String resourceId,
            String result,
            HttpServletRequest request
    ) {
        repository.save(new ActivityLog(
                UUID.randomUUID(),
                adminUser,
                action,
                resourceType,
                resourceId,
                result,
                clientIp(request),
                request == null ? null : request.getHeader("User-Agent"),
                clock.instant()
        ));
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
}
