package com.faouzi.portfolio.audit.domain;

import java.time.Instant;
import java.util.UUID;

import com.faouzi.portfolio.auth.domain.AdminUser;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "activity_log")
public class ActivityLog {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_user_id")
    private AdminUser adminUser;

    @Column(nullable = false, length = 120)
    private String action;

    @Column(name = "resource_type", length = 120)
    private String resourceType;

    @Column(name = "resource_id", length = 120)
    private String resourceId;

    @Column(nullable = false, length = 40)
    private String result;

    @Column(name = "ip_address", length = 64)
    private String ipAddress;

    @Column(name = "user_agent", length = 255)
    private String userAgent;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected ActivityLog() {
    }

    public ActivityLog(
            UUID id,
            AdminUser adminUser,
            String action,
            String resourceType,
            String resourceId,
            String result,
            String ipAddress,
            String userAgent,
            Instant createdAt
    ) {
        this.id = id;
        this.adminUser = adminUser;
        this.action = action;
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.result = result;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent == null ? null : userAgent.substring(0, Math.min(userAgent.length(), 255));
        this.createdAt = createdAt;
    }
}
