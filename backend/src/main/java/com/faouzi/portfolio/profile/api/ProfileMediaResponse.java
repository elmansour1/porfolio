package com.faouzi.portfolio.profile.api;

import java.util.UUID;

public record ProfileMediaResponse(
        UUID id,
        String fileName,
        String contentType,
        long sizeBytes,
        String altText,
        String url
) {
}
