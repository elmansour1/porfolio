package com.faouzi.portfolio.service.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ServiceTranslationRequest(
        @NotBlank @Pattern(regexp = "fr|en") String languageCode,
        @NotBlank @Size(max = 180) String title,
        @Size(max = 500) String summary,
        @Size(max = 6000) String description,
        @Size(max = 3000) String problem,
        @Size(max = 2000) String targetAudience,
        @Size(max = 120) String ctaLabel
) {
}
