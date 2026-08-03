package com.faouzi.portfolio.service.api.dto.response;

public record ServiceTranslationResponse(
        String languageCode,
        String title,
        String summary,
        String description,
        String problem,
        String targetAudience,
        String ctaLabel
) {
}
