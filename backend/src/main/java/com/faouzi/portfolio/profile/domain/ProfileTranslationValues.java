package com.faouzi.portfolio.profile.domain;

public record ProfileTranslationValues(
        String professionalTitle,
        String tagline,
        String shortSummary,
        String biography,
        String aboutText,
        String availabilityLabel,
        String primaryCtaLabel,
        String primaryCtaUrl,
        String secondaryCtaLabel,
        String secondaryCtaUrl,
        String footerText
) {
}
