package com.faouzi.portfolio.service.domain.model;

import java.time.Instant;
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
@Table(name = "professional_service")
public class ProfessionalService {

    private static final Pattern SLUG_PATTERN = Pattern.compile("^[a-z0-9]+(-[a-z0-9]+)*$");

    @Id
    private UUID id;

    @Column(length = 160)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(name = "publication_status", nullable = false, length = 20)
    private PublicationStatus publicationStatus;

    @Column(nullable = false)
    private boolean featured;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(length = 80)
    private String icon;

    @Column(name = "visual_url", length = 500)
    private String visualUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "cta_type", length = 30)
    private ServiceCtaType ctaType;

    @Column(name = "cta_target", length = 500)
    private String ctaTarget;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public ProfessionalService(UUID id, int displayOrder, Instant now) {
        this.id = id;
        this.publicationStatus = PublicationStatus.DRAFT;
        this.featured = false;
        this.displayOrder = displayOrder;
        this.createdAt = now;
        this.updatedAt = now;
    }

    public void update(
            String slug,
            boolean featured,
            int displayOrder,
            String icon,
            String visualUrl,
            ServiceCtaType ctaType,
            String ctaTarget,
            Instant now
    ) {
        this.slug = normalizeOptionalSlug(slug);
        this.featured = featured && publicationStatus == PublicationStatus.PUBLISHED;
        this.displayOrder = displayOrder;
        this.icon = blankToNull(icon);
        this.visualUrl = blankToNull(visualUrl);
        this.ctaType = ctaType;
        this.ctaTarget = blankToNull(ctaTarget);
        this.updatedAt = now;
    }

    public void publish(Instant now) {
        this.publicationStatus = PublicationStatus.PUBLISHED;
        this.updatedAt = now;
    }

    public void unpublish(Instant now) {
        this.publicationStatus = PublicationStatus.DRAFT;
        this.featured = false;
        this.updatedAt = now;
    }

    public void archive(Instant now) {
        this.publicationStatus = PublicationStatus.ARCHIVED;
        this.featured = false;
        this.updatedAt = now;
    }

    public void setFeatured(boolean featured, Instant now) {
        if (featured && publicationStatus != PublicationStatus.PUBLISHED) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "SERVICE_FEATURED_INVALID",
                    "Only published services can be featured.");
        }
        this.featured = featured;
        this.updatedAt = now;
    }

    public void reorder(int displayOrder, Instant now) {
        this.displayOrder = displayOrder;
        this.updatedAt = now;
    }

    static String normalizeOptionalSlug(String value) {
        if (value == null || value.trim().isBlank()) {
            return null;
        }
        String normalized = value.trim().toLowerCase(Locale.ROOT);
        if (!SLUG_PATTERN.matcher(normalized).matches()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "SERVICE_SLUG_INVALID",
                    "The slug must contain only lowercase letters, digits and hyphens.");
        }
        return normalized;
    }

    static String blankToNull(String value) {
        return value == null || value.trim().isBlank() ? null : value.trim();
    }
}
