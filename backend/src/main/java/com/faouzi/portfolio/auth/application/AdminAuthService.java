package com.faouzi.portfolio.auth.application;

import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import com.faouzi.portfolio.audit.application.ActivityLogService;
import com.faouzi.portfolio.auth.config.AuthProperties;
import com.faouzi.portfolio.auth.domain.AdminLoginAttempt;
import com.faouzi.portfolio.auth.domain.AdminLoginAttemptRepository;
import com.faouzi.portfolio.auth.domain.AdminUser;
import com.faouzi.portfolio.auth.domain.AdminUserRepository;
import com.faouzi.portfolio.auth.domain.PasswordResetToken;
import com.faouzi.portfolio.auth.domain.PasswordResetTokenRepository;
import com.faouzi.portfolio.shared.error.ApiException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminAuthService {

    private static final String GENERIC_RESET_MESSAGE =
            "If the administrator account exists, a reset procedure has been prepared.";

    private final AdminUserRepository users;
    private final AdminLoginAttemptRepository loginAttempts;
    private final PasswordResetTokenRepository resetTokens;
    private final PasswordEncoder passwordEncoder;
    private final PasswordPolicy passwordPolicy;
    private final SecureTokenGenerator tokenGenerator;
    private final TokenHasher tokenHasher;
    private final AuthProperties properties;
    private final ActivityLogService activityLogService;
    private final Clock clock;

    public AdminAuthService(
            AdminUserRepository users,
            AdminLoginAttemptRepository loginAttempts,
            PasswordResetTokenRepository resetTokens,
            PasswordEncoder passwordEncoder,
            PasswordPolicy passwordPolicy,
            SecureTokenGenerator tokenGenerator,
            TokenHasher tokenHasher,
            AuthProperties properties,
            ActivityLogService activityLogService,
            Clock clock
    ) {
        this.users = users;
        this.loginAttempts = loginAttempts;
        this.resetTokens = resetTokens;
        this.passwordEncoder = passwordEncoder;
        this.passwordPolicy = passwordPolicy;
        this.tokenGenerator = tokenGenerator;
        this.tokenHasher = tokenHasher;
        this.properties = properties;
        this.activityLogService = activityLogService;
        this.clock = clock;
    }

    @Transactional(noRollbackFor = ApiException.class)
    public AuthenticatedAdmin login(String email, String password, HttpServletRequest request) {
        String normalizedEmail = AdminUser.normalizeEmail(email);
        Instant now = clock.instant();
        AdminLoginAttempt attempt = loginAttempts.findById(normalizedEmail)
                .orElseGet(() -> new AdminLoginAttempt(normalizedEmail, now));

        if (attempt.lockedAt(now)) {
            activityLogService.record(null, "ADMIN_LOGIN_LOCKED", "admin_user", normalizedEmail, "FAILURE", request);
            throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, "LOGIN_LOCKED",
                    "Too many failed attempts. Please try again later.");
        }

        Optional<AdminUser> adminCandidate = users.findByEmail(normalizedEmail);
        if (adminCandidate.isEmpty()
                || !adminCandidate.get().enabled()
                || !passwordEncoder.matches(password, adminCandidate.get().passwordHash())) {
            attempt.recordFailure(properties.login().maxFailures(), properties.login().lockDuration(), now);
            loginAttempts.save(attempt);
            activityLogService.record(adminCandidate.orElse(null), "ADMIN_LOGIN_FAILURE", "admin_user", normalizedEmail,
                    "FAILURE", request);
            throw new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS",
                    "Invalid email or password.");
        }

        AdminUser admin = adminCandidate.get();
        attempt.reset(now);
        loginAttempts.save(attempt);
        admin.recordLogin(now);
        users.save(admin);
        persistSecurityContext(admin, request);
        activityLogService.record(admin, "ADMIN_LOGIN_SUCCESS", "admin_user", admin.id().toString(), "SUCCESS", request);
        return toAuthenticatedAdmin(admin);
    }

    @Transactional(readOnly = true)
    public AuthenticatedAdmin currentAdmin(String email) {
        AdminUser admin = users.findByEmail(AdminUser.normalizeEmail(email))
                .filter(AdminUser::enabled)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "SESSION_INVALID",
                        "The administrator session is no longer valid."));
        return toAuthenticatedAdmin(admin);
    }

    @Transactional
    public PasswordResetRequestResult requestPasswordReset(String email, HttpServletRequest request) {
        String normalizedEmail = AdminUser.normalizeEmail(email);
        Optional<AdminUser> adminCandidate = users.findByEmail(normalizedEmail).filter(AdminUser::enabled);
        String rawToken = null;
        Instant expiresAt = null;

        if (adminCandidate.isPresent()) {
            AdminUser admin = adminCandidate.get();
            rawToken = tokenGenerator.generate();
            Instant now = clock.instant();
            expiresAt = now.plus(properties.reset().tokenTtl());
            resetTokens.save(new PasswordResetToken(
                    java.util.UUID.randomUUID(),
                    admin,
                    tokenHasher.sha256(rawToken),
                    expiresAt,
                    now
            ));
            activityLogService.record(admin, "ADMIN_PASSWORD_RESET_REQUESTED", "admin_user", admin.id().toString(),
                    "SUCCESS", request);
        } else {
            activityLogService.record(null, "ADMIN_PASSWORD_RESET_REQUESTED", "admin_user", normalizedEmail,
                    "IGNORED", request);
        }

        return new PasswordResetRequestResult(
                GENERIC_RESET_MESSAGE,
                properties.reset().exposeToken() ? rawToken : null,
                properties.reset().exposeToken() ? expiresAt : null
        );
    }

    @Transactional
    public void resetPassword(String token, String newPassword, HttpServletRequest request) {
        passwordPolicy.validate(newPassword);
        Instant now = clock.instant();
        PasswordResetToken resetToken = resetTokens.findByTokenHash(tokenHasher.sha256(token))
                .orElseThrow(() -> invalidResetToken(request));

        if (!resetToken.usableAt(now)) {
            activityLogService.record(resetToken.adminUser(), "ADMIN_PASSWORD_RESET_EXPIRED", "admin_user",
                    resetToken.adminUser().id().toString(), "FAILURE", request);
            throw new ApiException(HttpStatus.BAD_REQUEST, "RESET_TOKEN_INVALID",
                    "The reset token is invalid or expired.");
        }

        AdminUser admin = resetToken.adminUser();
        admin.changePassword(passwordEncoder.encode(newPassword), now);
        resetToken.markUsed(now);
        users.save(admin);
        resetTokens.save(resetToken);
        activityLogService.record(admin, "ADMIN_PASSWORD_RESET_COMPLETED", "admin_user", admin.id().toString(),
                "SUCCESS", request);
    }

    @Transactional
    public void logout(String email, HttpServletRequest request) {
        users.findByEmail(AdminUser.normalizeEmail(email))
                .ifPresent(admin -> activityLogService.record(admin, "ADMIN_LOGOUT", "admin_user",
                        admin.id().toString(), "SUCCESS", request));
        SecurityContextHolder.clearContext();
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
    }

    private ApiException invalidResetToken(HttpServletRequest request) {
        activityLogService.record(null, "ADMIN_PASSWORD_RESET_INVALID_TOKEN", "admin_user", null, "FAILURE", request);
        return new ApiException(HttpStatus.BAD_REQUEST, "RESET_TOKEN_INVALID",
                "The reset token is invalid or expired.");
    }

    private void persistSecurityContext(AdminUser admin, HttpServletRequest request) {
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                admin.email(),
                null,
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        request.getSession(true).setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
    }

    private AuthenticatedAdmin toAuthenticatedAdmin(AdminUser admin) {
        return new AuthenticatedAdmin(admin.id(), admin.email(), admin.passwordChangeRequired());
    }
}
