package com.faouzi.portfolio.career.api.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CareerCertificationTranslationRequest(
        @Pattern(regexp = "fr|en") String languageCode,
        @Size(max = 220) String name,
        @Size(max = 5000) String description
) {
}
