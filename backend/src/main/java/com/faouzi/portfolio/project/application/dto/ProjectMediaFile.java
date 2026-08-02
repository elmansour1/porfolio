package com.faouzi.portfolio.project.application.dto;

import org.springframework.core.io.Resource;

public record ProjectMediaFile(Resource resource, String contentType, String originalFilename, long sizeBytes) {
}
