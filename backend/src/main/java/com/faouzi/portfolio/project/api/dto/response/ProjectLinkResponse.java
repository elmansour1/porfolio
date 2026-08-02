package com.faouzi.portfolio.project.api.dto.response;

import java.util.UUID;

public record ProjectLinkResponse(
        UUID id,
        String label,
        String url,
        int displayOrder
) {
}
