package com.faouzi.portfolio.service.api.dto.response;

import java.util.List;

import com.faouzi.portfolio.service.domain.model.ServiceCtaType;

public record ServicePublicResponse(
        String slug,
        String title,
        String summary,
        String description,
        String problem,
        String targetAudience,
        String icon,
        String visualUrl,
        boolean featured,
        int displayOrder,
        ServiceCtaType ctaType,
        String ctaTarget,
        String ctaLabel,
        List<PublicServiceItemResponse> benefits,
        List<PublicServiceItemResponse> deliverables,
        List<ServiceReferenceResponse> technologies,
        List<ServiceReferenceResponse> skills
) {
}
