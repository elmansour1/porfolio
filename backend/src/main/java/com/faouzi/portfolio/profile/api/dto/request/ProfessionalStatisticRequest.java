package com.faouzi.portfolio.profile.api.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProfessionalStatisticRequest(
        @NotBlank @Size(max = 80) String value,
        @NotBlank @Size(max = 120) String labelFr,
        @NotBlank @Size(max = 120) String labelEn,
        @Min(0) @Max(1000) int displayOrder,
        boolean visible
) {
}
