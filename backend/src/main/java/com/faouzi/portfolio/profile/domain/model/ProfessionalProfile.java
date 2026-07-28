package com.faouzi.portfolio.profile.domain.model;

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
@Table(name = "professional_profile")
public class ProfessionalProfile {

    @Id
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "publication_status", nullable = false, length = 20)
    private PublicationStatus publicationStatus;

    @Column(name = "first_name", nullable = false, length = 120)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 120)
    private String lastName;

    @Column(name = "display_name", nullable = false, length = 180)
    private String displayName;

    @Column(length = 180)
    private String location;

    @Column(length = 120)
    private String country;

    @Enumerated(EnumType.STRING)
    @Column(name = "availability_status", nullable = false, length = 40)
    private AvailabilityStatus availabilityStatus;

    @Column(name = "professional_email", length = 320)
    private String professionalEmail;

    @Column(length = 60)
    private String phone;

    @Column(name = "photo_media_id")
    private UUID photoMediaId;

    @Column(name = "cv_media_id")
    private UUID cvMediaId;

    @Column(name = "show_email", nullable = false)
    private boolean showEmail;

    @Column(name = "show_phone", nullable = false)
    private boolean showPhone;

    @Column(name = "show_photo", nullable = false)
    private boolean showPhoto;

    @Column(name = "show_cv", nullable = false)
    private boolean showCv;

    @Column(name = "show_links", nullable = false)
    private boolean showLinks;

    @Column(name = "show_statistics", nullable = false)
    private boolean showStatistics;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public ProfessionalProfile(UUID id, Instant now) {
        this.id = id;
        this.publicationStatus = PublicationStatus.DRAFT;
        this.firstName = "";
        this.lastName = "";
        this.displayName = "";
        this.availabilityStatus = AvailabilityStatus.HIDDEN;
        this.showEmail = false;
        this.showPhone = false;
        this.showPhoto = true;
        this.showCv = false;
        this.showLinks = true;
        this.showStatistics = true;
        this.createdAt = now;
        this.updatedAt = now;
    }

    public void update(
            PublicationStatus publicationStatus,
            String firstName,
            String lastName,
            String displayName,
            String location,
            String country,
            AvailabilityStatus availabilityStatus,
            String professionalEmail,
            String phone,
            boolean showEmail,
            boolean showPhone,
            boolean showPhoto,
            boolean showCv,
            boolean showLinks,
            boolean showStatistics,
            Instant now
    ) {
        this.publicationStatus = publicationStatus;
        this.firstName = normalize(firstName);
        this.lastName = normalize(lastName);
        this.displayName = normalize(displayName);
        this.location = blankToNull(location);
        this.country = blankToNull(country);
        this.availabilityStatus = availabilityStatus;
        this.professionalEmail = blankToNull(professionalEmail);
        this.phone = blankToNull(phone);
        this.showEmail = showEmail;
        this.showPhone = showPhone;
        this.showPhoto = showPhoto;
        this.showCv = showCv;
        this.showLinks = showLinks;
        this.showStatistics = showStatistics;
        this.updatedAt = now;
    }

    public void attachPhoto(UUID mediaId, Instant now) {
        this.photoMediaId = mediaId;
        this.updatedAt = now;
    }

    public void removePhoto(Instant now) {
        this.photoMediaId = null;
        this.updatedAt = now;
    }

    public void attachCv(UUID mediaId, Instant now) {
        this.cvMediaId = mediaId;
        this.updatedAt = now;
    }

    public void removeCv(Instant now) {
        this.cvMediaId = null;
        this.updatedAt = now;
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    private String blankToNull(String value) {
        String normalized = normalize(value);
        return normalized.isBlank() ? null : normalized;
    }
}
