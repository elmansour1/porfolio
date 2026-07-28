package com.faouzi.portfolio.skills.api.dto.response;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.profile.domain.model.PublicationStatus;

public record SkillCategoryResponse(
        UUID id,
        PublicationStatus publicationStatus,
        String icon,
        int displayOrder,
        long skillCount,
        Instant createdAt,
        Instant updatedAt,
        List<SkillCategoryTranslationResponse> translations
) {
}
