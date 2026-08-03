package com.faouzi.portfolio.service.api.dto.response;

public record PublicServiceItemResponse(
        String label,
        String description,
        int displayOrder
) {
}
