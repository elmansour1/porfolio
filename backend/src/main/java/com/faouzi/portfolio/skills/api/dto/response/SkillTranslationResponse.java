package com.faouzi.portfolio.skills.api.dto.response;

public record SkillTranslationResponse(
        String languageCode,
        String name,
        String description,
        String usageSummary
) {
}
