package com.faouzi.portfolio.skills.api.dto.response;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.profile.domain.model.PublicationStatus;
import com.faouzi.portfolio.skills.domain.model.SkillLevel;

public record SkillResponse(
        UUID id,
        UUID categoryId,
        String categoryNameFr,
        PublicationStatus publicationStatus,
        SkillLevel level,
        String icon,
        boolean featured,
        boolean visible,
        int displayOrder,
        Instant createdAt,
        Instant updatedAt,
        List<SkillTranslationResponse> translations
) {
}
