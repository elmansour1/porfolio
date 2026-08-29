package com.faouzi.portfolio.contact.domain.model;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "contact_message")
public class ContactMessage {

    @Id
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ContactMessageStatus status;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(nullable = false, length = 320)
    private String email;

    @Column(length = 160)
    private String company;

    @Enumerated(EnumType.STRING)
    @Column(name = "request_type", nullable = false, length = 20)
    private ContactRequestType requestType;

    @Column(nullable = false, length = 200)
    private String subject;

    @Column(nullable = false, columnDefinition = "text")
    private String message;

    @Column(nullable = false)
    private boolean consent;

    @Column(name = "ip_address", length = 64)
    private String ipAddress;

    @Column(name = "user_agent", length = 300)
    private String userAgent;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public ContactMessage(
            UUID id,
            String name,
            String email,
            String company,
            ContactRequestType requestType,
            String subject,
            String message,
            boolean consent,
            String ipAddress,
            String userAgent,
            Instant now
    ) {
        this.id = id;
        this.status = ContactMessageStatus.NEW;
        this.name = name.trim();
        this.email = email.trim();
        this.company = blankToNull(company);
        this.requestType = requestType;
        this.subject = subject.trim();
        this.message = message.trim();
        this.consent = consent;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.createdAt = now;
        this.updatedAt = now;
    }

    public void changeStatus(ContactMessageStatus status, Instant now) {
        this.status = status;
        this.updatedAt = now;
    }

    private static String blankToNull(String value) {
        return value == null || value.trim().isBlank() ? null : value.trim();
    }
}
