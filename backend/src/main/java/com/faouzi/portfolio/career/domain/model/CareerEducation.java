package com.faouzi.portfolio.career.domain.model;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import com.faouzi.portfolio.profile.domain.model.PublicationStatus;

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
@Table(name = "career_education")
public class CareerEducation {

    @Id
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "publication_status", nullable = false, length = 20)
    private PublicationStatus publicationStatus;

    @Column(nullable = false, length = 180)
    private String institution;

    @Enumerated(EnumType.STRING)
    @Column(name = "education_level", length = 30)
    private EducationLevel educationLevel;

    @Column(length = 180)
    private String location;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "current_education", nullable = false)
    private boolean currentEducation;

    @Column(length = 500)
    private String url;

    @Column(name = "logo_media_id")
    private UUID logoMediaId;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public CareerEducation(UUID id, int displayOrder, Instant now) {
        this.id = id;
        this.publicationStatus = PublicationStatus.DRAFT;
        this.institution = "";
        this.currentEducation = false;
        this.displayOrder = displayOrder;
        this.createdAt = now;
        this.updatedAt = now;
    }

    public void update(
            PublicationStatus publicationStatus,
            String institution,
            EducationLevel educationLevel,
            String location,
            LocalDate startDate,
            LocalDate endDate,
            boolean currentEducation,
            String url,
            UUID logoMediaId,
            int displayOrder,
            Instant now
    ) {
        CareerExperience.validateDates(startDate, endDate, currentEducation, "EDUCATION_DATES_INVALID");
        this.publicationStatus = publicationStatus;
        this.institution = CareerExperience.normalize(institution);
        this.educationLevel = educationLevel;
        this.location = CareerExperience.blankToNull(location);
        this.startDate = startDate;
        this.endDate = currentEducation ? null : endDate;
        this.currentEducation = currentEducation;
        this.url = CareerExperience.blankToNull(url);
        this.logoMediaId = logoMediaId;
        this.displayOrder = displayOrder;
        this.updatedAt = now;
    }
}
