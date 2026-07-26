package com.faouzi.portfolio.profile.api;

import java.util.UUID;

import com.faouzi.portfolio.profile.domain.ProfessionalLinkType;

public record ProfessionalLinkResponse(
        UUID id,
        ProfessionalLinkType type,
        String label,
        String url,
        String icon,
        int displayOrder,
        boolean visible,
        boolean openInNewTab
) {
}
