package com.faouzi.portfolio.service.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ServiceItemTranslationRequest(
        @NotBlank @Pattern(regexp = "fr|en") String languageCode,
        @NotBlank @Size(max = 180) String label,
        @Size(max = 500) String description
) {
}
