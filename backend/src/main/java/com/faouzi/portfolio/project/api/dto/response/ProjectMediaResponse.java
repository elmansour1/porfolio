package com.faouzi.portfolio.project.api.dto.response;

import java.util.UUID;

public record ProjectMediaResponse(
        UUID id,
        String kind,
        String url,
        String altText,
        String caption,
        int displayOrder,
        String originalFilename,
        long sizeBytes
) {
}
