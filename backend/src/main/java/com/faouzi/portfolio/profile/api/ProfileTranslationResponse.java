package com.faouzi.portfolio.profile.api;

public record ProfileTranslationResponse(
        String languageCode,
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
