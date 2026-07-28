package com.faouzi.portfolio.auth.application.service;

import java.time.Clock;
import java.time.Instant;
import java.util.UUID;

import com.faouzi.portfolio.audit.application.service.ActivityLogService;
import com.faouzi.portfolio.auth.config.AuthProperties;
import com.faouzi.portfolio.auth.domain.model.AdminUser;
import com.faouzi.portfolio.auth.infrastructure.persistence.AdminUserRepository;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminBootstrapService implements ApplicationRunner {

    private static final Logger LOGGER = LoggerFactory.getLogger(AdminBootstrapService.class);

    private final AdminUserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final PasswordPolicy passwordPolicy;
    private final AuthProperties properties;
    private final ActivityLogService activityLogService;
    private final Clock clock;

    @Override
    public void run(ApplicationArguments args) {
        AuthProperties.Bootstrap bootstrap = properties.bootstrap();
        boolean emailProvided = bootstrap.email() != null && !bootstrap.email().isBlank();
        boolean passwordProvided = bootstrap.password() != null && !bootstrap.password().isBlank();

        if (!emailProvided && !passwordProvided) {
            return;
        }
        if (emailProvided != passwordProvided) {
            throw new IllegalStateException("Both ADMIN_BOOTSTRAP_EMAIL and ADMIN_BOOTSTRAP_PASSWORD are required.");
        }
        if (users.count() > 0) {
            LOGGER.info("Admin bootstrap skipped because an administrator already exists.");
            return;
        }

        passwordPolicy.validate(bootstrap.password());
        Instant now = clock.instant();
        AdminUser admin = users.save(new AdminUser(
                UUID.randomUUID(),
                bootstrap.email(),
                passwordEncoder.encode(bootstrap.password()),
                false,
                now
        ));
        activityLogService.record(admin, "ADMIN_BOOTSTRAP_CREATED", "admin_user", admin.getId().toString(), "SUCCESS", null);
        LOGGER.info("Initial administrator account created from environment configuration.");
    }
}
