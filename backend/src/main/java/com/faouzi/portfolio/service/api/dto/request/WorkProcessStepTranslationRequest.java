package com.faouzi.portfolio.service.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record WorkProcessStepTranslationRequest(
        @NotBlank @Pattern(regexp = "fr|en") String languageCode,
        @NotBlank @Size(max = 180) String title,
        @Size(max = 3000) String description,
        @Size(max = 500) String expectedResult
) {
}
