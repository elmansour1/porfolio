package com.faouzi.portfolio.service.api.dto.response;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.profile.domain.model.PublicationStatus;
import com.faouzi.portfolio.service.domain.model.ServiceCtaType;

public record ServiceAdminSummaryResponse(
        UUID id,
        String slug,
        String title,
        PublicationStatus publicationStatus,
        boolean featured,
        int displayOrder,
        String icon,
        ServiceCtaType ctaType,
        Instant updatedAt,
        List<ServiceReferenceResponse> technologies,
        List<ServiceReferenceResponse> skills
) {
}
