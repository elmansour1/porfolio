package com.faouzi.portfolio.career.api.dto.response;

public record CareerEducationTranslationResponse(
        String languageCode,
        String title,
        String field,
        String description
) {
}
