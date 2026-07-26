package com.faouzi.portfolio.profile.api;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record SectionSettingRequest(
        @NotBlank String sectionKey,
        boolean visible,
        @Min(0) @Max(1000) int displayOrder
) {
}
