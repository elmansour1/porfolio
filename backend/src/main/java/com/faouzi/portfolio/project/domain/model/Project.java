package com.faouzi.portfolio.project.domain.model;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;

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
@Table(name = "project")
public class Project {

    private static final Pattern SLUG_PATTERN = Pattern.compile("^[a-z0-9]+(-[a-z0-9]+)*$");

    @Id
    private UUID id;

    @Column(nullable = false, length = 160)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(name = "project_type", nullable = false, length = 30)
    private ProjectType projectType;

    @Enumerated(EnumType.STRING)
    @Column(name = "real_status", nullable = false, length = 20)
    private ProjectRealStatus realStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "publication_status", nullable = false, length = 20)
    private PublicationStatus publicationStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProjectConfidentiality confidentiality;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(nullable = false)
    private boolean ongoing;

    @Column(nullable = false)
    private boolean featured;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(name = "demo_url", length = 500)
    private String demoUrl;

    @Column(name = "github_url", length = 500)
    private String githubUrl;

    @Column(nullable = false)
    private boolean indexable;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public Project(UUID id, String slug, int displayOrder, Instant now) {
        this.id = id;
        this.slug = normalizeSlug(slug);
        this.projectType = ProjectType.OTHER;
        this.realStatus = ProjectRealStatus.IN_PROGRESS;
        this.publicationStatus = PublicationStatus.DRAFT;
        this.confidentiality = ProjectConfidentiality.PUBLIC;
        this.ongoing = false;
        this.featured = false;
        this.displayOrder = displayOrder;
        this.indexable = true;
        this.createdAt = now;
        this.updatedAt = now;
    }

    public void update(
            String slug,
            ProjectType projectType,
            ProjectRealStatus realStatus,
            PublicationStatus publicationStatus,
            ProjectConfidentiality confidentiality,
            LocalDate startDate,
            LocalDate endDate,
            boolean ongoing,
            boolean featured,
            int displayOrder,
            String demoUrl,
            String githubUrl,
            boolean indexable,
            Instant now
    ) {
        validateDates(startDate, endDate, ongoing);
        this.slug = normalizeSlug(slug);
        this.projectType = projectType;
        this.realStatus = realStatus;
        this.publicationStatus = publicationStatus;
        this.confidentiality = confidentiality;
        this.startDate = startDate;
        this.endDate = ongoing ? null : endDate;
        this.ongoing = ongoing;
        this.featured = featured;
        this.displayOrder = displayOrder;
        this.demoUrl = blankToNull(demoUrl);
        this.githubUrl = blankToNull(githubUrl);
        this.indexable = indexable;
        this.updatedAt = now;
    }

    public void reorder(int displayOrder, Instant now) {
        this.displayOrder = displayOrder;
        this.updatedAt = now;
    }

    public void setFeatured(boolean featured, Instant now) {
        this.featured = featured;
        this.updatedAt = now;
    }

    public void archive(Instant now) {
        this.publicationStatus = PublicationStatus.ARCHIVED;
        this.updatedAt = now;
    }

    public void publish(Instant now) {
        this.publicationStatus = PublicationStatus.PUBLISHED;
        this.updatedAt = now;
    }

    public void unpublish(Instant now) {
        this.publicationStatus = PublicationStatus.DRAFT;
        this.updatedAt = now;
    }

    static void validateDates(LocalDate startDate, LocalDate endDate, boolean ongoing) {
        if (ongoing && endDate != null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "PROJECT_DATES_INVALID",
                    "An ongoing project cannot have an end date.");
        }
        if (!ongoing && startDate != null && endDate != null && endDate.isBefore(startDate)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "PROJECT_DATES_INVALID",
                    "The end date must be after the start date.");
        }
    }

    static String normalizeSlug(String value) {
        String normalized = value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
        if (normalized.isBlank() || !SLUG_PATTERN.matcher(normalized).matches()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "PROJECT_SLUG_INVALID",
                    "The slug must contain only lowercase letters, digits and hyphens.");
        }
        return normalized;
    }

    static String blankToNull(String value) {
        return value == null || value.trim().isBlank() ? null : value.trim();
    }
}
