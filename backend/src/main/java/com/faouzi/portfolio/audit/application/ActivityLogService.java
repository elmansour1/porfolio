package com.faouzi.portfolio.audit.application;

import java.time.Clock;
import java.util.UUID;

import com.faouzi.portfolio.audit.domain.ActivityLog;
import com.faouzi.portfolio.audit.domain.ActivityLogRepository;
import com.faouzi.portfolio.auth.domain.AdminUser;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ActivityLogService {

    private final ActivityLogRepository repository;
    private final Clock clock;

    public ActivityLogService(ActivityLogRepository repository, Clock clock) {
        this.repository = repository;
        this.clock = clock;
    }

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
