package com.faouzi.portfolio.career.api.dto.response;

public record CareerCertificationTranslationResponse(
        String languageCode,
        String name,
        String description
) {
}
