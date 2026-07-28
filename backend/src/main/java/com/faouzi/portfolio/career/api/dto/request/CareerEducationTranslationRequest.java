package com.faouzi.portfolio.career.api.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CareerEducationTranslationRequest(
        @Pattern(regexp = "fr|en") String languageCode,
        @Size(max = 220) String title,
        @Size(max = 180) String field,
        @Size(max = 5000) String description
) {
}
