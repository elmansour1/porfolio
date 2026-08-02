package com.faouzi.portfolio.project.api.dto.response;

public record ProjectTranslationResponse(
        String languageCode,
        String title,
        String summary,
        String description,
        String context,
        String problem,
        String objectives,
        String targetUsers,
        String role,
        String responsibilities,
        String solution,
        String architectureNotes,
        String features,
        String challenges,
        String decisions,
        String results,
        String seoTitle,
        String seoDescription
) {
}
