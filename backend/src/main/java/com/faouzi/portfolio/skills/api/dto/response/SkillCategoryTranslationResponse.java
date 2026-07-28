package com.faouzi.portfolio.skills.api.dto.response;

public record SkillCategoryTranslationResponse(
        String languageCode,
        String name,
        String description
) {
}
