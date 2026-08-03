package com.faouzi.portfolio.service.api.dto.response;

import java.util.List;
import java.util.UUID;

public record BenefitResponse(
        UUID id,
        boolean active,
        int displayOrder,
        List<ServiceItemTranslationResponse> translations
) {
}
