package com.faouzi.portfolio.profile.api;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ProfileTranslationRequest(
        @Pattern(regexp = "fr|en") String languageCode,
        @Size(max = 180) String professionalTitle,
        @Size(max = 240) String tagline,
        @Size(max = 600) String shortSummary,
        @Size(max = 5000) String biography,
        @Size(max = 5000) String aboutText,
        @Size(max = 160) String availabilityLabel,
        @Size(max = 120) String primaryCtaLabel,
        @Size(max = 500) String primaryCtaUrl,
        @Size(max = 120) String secondaryCtaLabel,
        @Size(max = 500) String secondaryCtaUrl,
        @Size(max = 500) String footerText
) {
}
