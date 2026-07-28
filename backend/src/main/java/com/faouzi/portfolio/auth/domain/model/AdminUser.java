package com.faouzi.portfolio.auth.domain.model;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "admin_user")
public class AdminUser {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true, length = 320)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private boolean enabled;

    @Column(name = "password_change_required", nullable = false)
    private boolean passwordChangeRequired;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public AdminUser(UUID id, String email, String passwordHash, boolean passwordChangeRequired, Instant now) {
        this.id = id;
        this.email = normalizeEmail(email);
        this.passwordHash = passwordHash;
        this.enabled = true;
        this.passwordChangeRequired = passwordChangeRequired;
        this.createdAt = now;
        this.updatedAt = now;
    }

    public void recordLogin(Instant now) {
        this.lastLoginAt = now;
        this.updatedAt = now;
    }

    public void changePassword(String passwordHash, Instant now) {
        this.passwordHash = passwordHash;
        this.passwordChangeRequired = false;
        this.updatedAt = now;
    }

    public static String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }
}
