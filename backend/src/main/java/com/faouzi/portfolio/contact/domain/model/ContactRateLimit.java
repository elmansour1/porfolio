package com.faouzi.portfolio.contact.domain.model;

import java.time.Duration;
import java.time.Instant;

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
@Table(name = "contact_rate_limit")
public class ContactRateLimit {

    @Id
    @Column(name = "ip_address", length = 64)
    private String ipAddress;

    @Column(name = "submission_count", nullable = false)
    private int submissionCount;

    @Column(name = "window_started_at", nullable = false)
    private Instant windowStartedAt;

    @Column(name = "last_submission_at", nullable = false)
    private Instant lastSubmissionAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public ContactRateLimit(String ipAddress, Instant now) {
        this.ipAddress = ipAddress;
        this.submissionCount = 0;
        this.windowStartedAt = now;
        this.lastSubmissionAt = now;
        this.updatedAt = now;
    }

    /**
     * Registers a new submission attempt, resetting the sliding window when it has expired.
     *
     * @return {@code true} if the attempt is allowed under the configured limit, {@code false} otherwise.
     */
    public boolean registerAttempt(int maxSubmissions, Duration window, Instant now) {
        if (windowStartedAt == null || windowStartedAt.plus(window).isBefore(now)) {
            this.windowStartedAt = now;
            this.submissionCount = 0;
        }
        this.submissionCount += 1;
        this.lastSubmissionAt = now;
        this.updatedAt = now;
        return this.submissionCount <= maxSubmissions;
    }
}
