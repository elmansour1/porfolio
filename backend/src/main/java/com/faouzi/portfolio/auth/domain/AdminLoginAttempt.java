package com.faouzi.portfolio.auth.domain;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "admin_login_attempt")
public class AdminLoginAttempt {

    @Id
    @Column(length = 320)
    private String email;

    @Column(name = "failure_count", nullable = false)
    private int failureCount;

    @Column(name = "locked_until")
    private Instant lockedUntil;

    @Column(name = "last_failure_at")
    private Instant lastFailureAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected AdminLoginAttempt() {
    }

    public AdminLoginAttempt(String email, Instant now) {
        this.email = AdminUser.normalizeEmail(email);
        this.failureCount = 0;
        this.updatedAt = now;
    }

    public boolean lockedAt(Instant now) {
        return lockedUntil != null && lockedUntil.isAfter(now);
    }

    public int failureCount() {
        return failureCount;
    }

    public Instant lockedUntil() {
        return lockedUntil;
    }

    public void recordFailure(int maxFailures, java.time.Duration lockDuration, Instant now) {
        this.failureCount += 1;
        this.lastFailureAt = now;
        this.updatedAt = now;
        if (this.failureCount >= maxFailures) {
            this.lockedUntil = now.plus(lockDuration);
        }
    }

    public void reset(Instant now) {
        this.failureCount = 0;
        this.lockedUntil = null;
        this.updatedAt = now;
    }
}
