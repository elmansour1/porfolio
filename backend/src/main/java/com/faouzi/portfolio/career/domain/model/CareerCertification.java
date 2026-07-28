package com.faouzi.portfolio.career.domain.model;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import com.faouzi.portfolio.profile.domain.model.PublicationStatus;
import com.faouzi.portfolio.shared.error.ApiException;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "career_certification")
public class CareerCertification {

    @Id
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "publication_status", nullable = false, length = 20)
    private PublicationStatus publicationStatus;

    @Column(nullable = false, length = 180)
    private String issuer;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "no_expiry", nullable = false)
    private boolean noExpiry;

    @Column(name = "credential_id", length = 180)
    private String credentialId;

    @Column(name = "verification_url", length = 500)
    private String verificationUrl;

    @Column(name = "document_media_id")
    private UUID documentMediaId;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public CareerCertification(UUID id, int displayOrder, Instant now) {
        this.id = id;
        this.publicationStatus = PublicationStatus.DRAFT;
        this.issuer = "";
        this.noExpiry = true;
        this.displayOrder = displayOrder;
        this.createdAt = now;
        this.updatedAt = now;
    }

    public void update(
            PublicationStatus publicationStatus,
            String issuer,
            LocalDate issueDate,
            LocalDate expiryDate,
            boolean noExpiry,
            String credentialId,
            String verificationUrl,
            UUID documentMediaId,
            int displayOrder,
            Instant now
    ) {
        validateDates(issueDate, expiryDate, noExpiry);
        this.publicationStatus = publicationStatus;
        this.issuer = CareerExperience.normalize(issuer);
        this.issueDate = issueDate;
        this.expiryDate = noExpiry ? null : expiryDate;
        this.noExpiry = noExpiry;
        this.credentialId = CareerExperience.blankToNull(credentialId);
        this.verificationUrl = CareerExperience.blankToNull(verificationUrl);
        this.documentMediaId = documentMediaId;
        this.displayOrder = displayOrder;
        this.updatedAt = now;
    }

    private void validateDates(LocalDate issueDate, LocalDate expiryDate, boolean noExpiry) {
        if (issueDate == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "CERTIFICATION_DATES_INVALID", "An issue date is required.");
        }
        if (!noExpiry && expiryDate != null && expiryDate.isBefore(issueDate)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "CERTIFICATION_DATES_INVALID", "The expiry date must be after the issue date.");
        }
    }
}
