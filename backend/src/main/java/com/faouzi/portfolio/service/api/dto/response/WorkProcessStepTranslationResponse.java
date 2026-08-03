package com.faouzi.portfolio.service.api.dto.response;

public record WorkProcessStepTranslationResponse(
        String languageCode,
        String title,
        String description,
        String expectedResult
) {
}
