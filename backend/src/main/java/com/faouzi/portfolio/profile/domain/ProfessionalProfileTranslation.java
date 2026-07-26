package com.faouzi.portfolio.profile.domain;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "professional_profile_translation")
public class ProfessionalProfileTranslation {

    @Id
    private UUID id;

    @Column(name = "profile_id", nullable = false)
    private UUID profileId;

    @Column(name = "language_code", nullable = false, length = 2)
    private String languageCode;

    @Column(name = "professional_title", length = 180)
    private String professionalTitle;

    @Column(length = 240)
    private String tagline;

    @Column(name = "short_summary", length = 600)
    private String shortSummary;

    @Column(columnDefinition = "text")
    private String biography;

    @Column(name = "about_text", columnDefinition = "text")
    private String aboutText;

    @Column(name = "availability_label", length = 160)
    private String availabilityLabel;

    @Column(name = "primary_cta_label", length = 120)
    private String primaryCtaLabel;

    @Column(name = "primary_cta_url", length = 500)
    private String primaryCtaUrl;

    @Column(name = "secondary_cta_label", length = 120)
    private String secondaryCtaLabel;

    @Column(name = "secondary_cta_url", length = 500)
    private String secondaryCtaUrl;

    @Column(name = "footer_text", length = 500)
    private String footerText;

    protected ProfessionalProfileTranslation() {
    }

    public ProfessionalProfileTranslation(UUID id, UUID profileId, String languageCode) {
        this.id = id;
        this.profileId = profileId;
        this.languageCode = languageCode;
    }

    public void update(ProfileTranslationValues values) {
        this.professionalTitle = blankToNull(values.professionalTitle());
        this.tagline = blankToNull(values.tagline());
        this.shortSummary = blankToNull(values.shortSummary());
        this.biography = blankToNull(values.biography());
        this.aboutText = blankToNull(values.aboutText());
        this.availabilityLabel = blankToNull(values.availabilityLabel());
        this.primaryCtaLabel = blankToNull(values.primaryCtaLabel());
        this.primaryCtaUrl = blankToNull(values.primaryCtaUrl());
        this.secondaryCtaLabel = blankToNull(values.secondaryCtaLabel());
        this.secondaryCtaUrl = blankToNull(values.secondaryCtaUrl());
        this.footerText = blankToNull(values.footerText());
    }

    public UUID id() {
        return id;
    }

    public String languageCode() {
        return languageCode;
    }

    public String professionalTitle() {
        return professionalTitle;
    }

    public String tagline() {
        return tagline;
    }

    public String shortSummary() {
        return shortSummary;
    }

    public String biography() {
        return biography;
    }

    public String aboutText() {
        return aboutText;
    }

    public String availabilityLabel() {
        return availabilityLabel;
    }

    public String primaryCtaLabel() {
        return primaryCtaLabel;
    }

    public String primaryCtaUrl() {
        return primaryCtaUrl;
    }

    public String secondaryCtaLabel() {
        return secondaryCtaLabel;
    }

    public String secondaryCtaUrl() {
        return secondaryCtaUrl;
    }

    public String footerText() {
        return footerText;
    }

    private String blankToNull(String value) {
        if (value == null || value.trim().isBlank()) {
            return null;
        }
        return value.trim();
    }
}
