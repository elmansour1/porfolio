package com.faouzi.portfolio.service.api.dto.response;

public record WorkProcessStepPublicResponse(
        String title,
        String description,
        String expectedResult,
        int displayOrder,
        String icon
) {
}
