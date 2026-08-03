package com.faouzi.portfolio.service.api.dto.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateWorkProcessStepRequest(
        @Min(0) int displayOrder,
        @Size(max = 80) String icon,
        @NotNull @Valid List<WorkProcessStepTranslationRequest> translations
) {
}
