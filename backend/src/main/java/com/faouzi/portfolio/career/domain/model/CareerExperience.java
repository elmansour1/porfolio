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
@Table(name = "career_experience")
public class CareerExperience {

    @Id
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "publication_status", nullable = false, length = 20)
    private PublicationStatus publicationStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "experience_type", nullable = false, length = 30)
    private ExperienceType experienceType;

    @Enumerated(EnumType.STRING)
    @Column(name = "contract_type", length = 30)
    private ContractType contractType;

    @Column(length = 180)
    private String organization;

    @Column(name = "role_title", nullable = false, length = 180)
    private String roleTitle;

    @Column(length = 180)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "work_mode", nullable = false, length = 20)
    private WorkMode workMode;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "current_position", nullable = false)
    private boolean currentPosition;

    @Column(nullable = false)
    private boolean confidential;

    @Column(name = "organization_url", length = 500)
    private String organizationUrl;

    @Column(name = "logo_media_id")
    private UUID logoMediaId;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public CareerExperience(UUID id, int displayOrder, Instant now) {
        this.id = id;
        this.publicationStatus = PublicationStatus.DRAFT;
        this.experienceType = ExperienceType.EMPLOYMENT;
        this.workMode = WorkMode.HYBRID;
        this.roleTitle = "";
        this.currentPosition = false;
        this.confidential = false;
        this.displayOrder = displayOrder;
        this.createdAt = now;
        this.updatedAt = now;
    }

    public void update(
            PublicationStatus publicationStatus,
            ExperienceType experienceType,
            ContractType contractType,
            String organization,
            String roleTitle,
            String location,
            WorkMode workMode,
            LocalDate startDate,
            LocalDate endDate,
            boolean currentPosition,
            boolean confidential,
            String organizationUrl,
            UUID logoMediaId,
            int displayOrder,
            Instant now
    ) {
        validateDates(startDate, endDate, currentPosition, "EXPERIENCE_DATES_INVALID");
        this.publicationStatus = publicationStatus;
        this.experienceType = experienceType;
        this.contractType = contractType;
        this.organization = blankToNull(organization);
        this.roleTitle = normalize(roleTitle);
        this.location = blankToNull(location);
        this.workMode = workMode;
        this.startDate = startDate;
        this.endDate = currentPosition ? null : endDate;
        this.currentPosition = currentPosition;
        this.confidential = confidential;
        this.organizationUrl = blankToNull(organizationUrl);
        this.logoMediaId = logoMediaId;
        this.displayOrder = displayOrder;
        this.updatedAt = now;
    }

    static void validateDates(LocalDate startDate, LocalDate endDate, boolean current, String code) {
        if (startDate == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, code, "A start date is required.");
        }
        if (current) {
            return;
        }
        if (endDate == null || endDate.isBefore(startDate)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, code, "The end date must be after the start date.");
        }
    }

    static String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    static String blankToNull(String value) {
        String normalized = normalize(value);
        return normalized.isBlank() ? null : normalized;
    }
}
