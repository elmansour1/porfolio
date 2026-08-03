package com.faouzi.portfolio.service.api.dto.response;

public record ServiceItemTranslationResponse(
        String languageCode,
        String label,
        String description
) {
}
