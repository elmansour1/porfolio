package com.faouzi.portfolio.service.domain.model;

import java.util.UUID;

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
@Table(name = "professional_service_translation")
public class ProfessionalServiceTranslation {

    @Id
    private UUID id;

    @Column(name = "service_id", nullable = false)
    private UUID serviceId;

    @Column(name = "language_code", nullable = false, length = 2)
    private String languageCode;

    @Column(nullable = false, length = 180)
    private String title;

    @Column(length = 500)
    private String summary;

    @Column(columnDefinition = "text")
    private String description;

    @Column(columnDefinition = "text")
    private String problem;

    @Column(name = "target_audience", columnDefinition = "text")
    private String targetAudience;

    @Column(name = "cta_label", length = 120)
    private String ctaLabel;

    public ProfessionalServiceTranslation(UUID id, UUID serviceId, String languageCode) {
        this.id = id;
        this.serviceId = serviceId;
        this.languageCode = languageCode;
    }

    public void update(String title, String summary, String description, String problem, String targetAudience, String ctaLabel) {
        this.title = title == null ? "" : title.trim();
        this.summary = blankToNull(summary);
        this.description = blankToNull(description);
        this.problem = blankToNull(problem);
        this.targetAudience = blankToNull(targetAudience);
        this.ctaLabel = blankToNull(ctaLabel);
    }

    private String blankToNull(String value) {
        return value == null || value.trim().isBlank() ? null : value.trim();
    }
}
