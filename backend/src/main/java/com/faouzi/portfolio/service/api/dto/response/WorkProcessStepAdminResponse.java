package com.faouzi.portfolio.service.api.dto.response;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.profile.domain.model.PublicationStatus;

public record WorkProcessStepAdminResponse(
        UUID id,
        PublicationStatus publicationStatus,
        int displayOrder,
        String icon,
        Instant createdAt,
        Instant updatedAt,
        List<WorkProcessStepTranslationResponse> translations
) {
}
