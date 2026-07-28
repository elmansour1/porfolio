package com.faouzi.portfolio.skills.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SkillTranslationRequest(
        @NotBlank
        @Pattern(regexp = "fr|en")
        String languageCode,

        @NotBlank
        @Size(max = 160)
        String name,

        @Size(max = 600)
        String description,

        @Size(max = 600)
        String usageSummary
) {
}
