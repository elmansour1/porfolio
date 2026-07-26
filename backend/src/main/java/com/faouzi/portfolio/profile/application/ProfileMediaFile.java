package com.faouzi.portfolio.profile.application;

import org.springframework.core.io.Resource;

public record ProfileMediaFile(
        Resource resource,
        String contentType,
        String originalFilename,
        long sizeBytes
) {
}
