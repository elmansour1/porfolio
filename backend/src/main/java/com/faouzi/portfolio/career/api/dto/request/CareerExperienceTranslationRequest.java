package com.faouzi.portfolio.career.api.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CareerExperienceTranslationRequest(
        @Pattern(regexp = "fr|en") String languageCode,
        @Size(max = 800) String summary,
        @Size(max = 5000) String missions,
        @Size(max = 5000) String achievements,
        @Size(max = 180) String confidentialLabel
) {
}
