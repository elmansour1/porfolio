package com.faouzi.portfolio.service.api.dto.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record BenefitRequest(
        boolean active,
        @Min(0) int displayOrder,
        @NotNull @Valid List<ServiceItemTranslationRequest> translations
) {
}
