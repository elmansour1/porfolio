package com.faouzi.portfolio.career.api.dto.response;

public record CareerExperienceTranslationResponse(
        String languageCode,
        String summary,
        String missions,
        String achievements,
        String confidentialLabel
) {
}
