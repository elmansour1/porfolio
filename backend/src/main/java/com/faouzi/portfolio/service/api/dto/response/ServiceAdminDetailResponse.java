package com.faouzi.portfolio.service.api.dto.response;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.profile.domain.model.PublicationStatus;
import com.faouzi.portfolio.service.domain.model.ServiceCtaType;

public record ServiceAdminDetailResponse(
        UUID id,
        String slug,
        PublicationStatus publicationStatus,
        boolean featured,
        int displayOrder,
        String icon,
        String visualUrl,
        ServiceCtaType ctaType,
        String ctaTarget,
        Instant createdAt,
        Instant updatedAt,
        List<ServiceTranslationResponse> translations,
        List<BenefitResponse> benefits,
        List<DeliverableResponse> deliverables,
        List<ServiceReferenceResponse> technologies,
        List<ServiceReferenceResponse> skills
) {
}
