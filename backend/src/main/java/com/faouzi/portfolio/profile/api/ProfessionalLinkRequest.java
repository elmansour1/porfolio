package com.faouzi.portfolio.profile.api;

import com.faouzi.portfolio.profile.domain.ProfessionalLinkType;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProfessionalLinkRequest(
        @NotNull ProfessionalLinkType type,
        @NotBlank @Size(max = 120) String label,
        @NotBlank @Size(max = 500) String url,
        @Size(max = 80) String icon,
        @Min(0) @Max(1000) int displayOrder,
        boolean visible,
        boolean openInNewTab
) {
}
