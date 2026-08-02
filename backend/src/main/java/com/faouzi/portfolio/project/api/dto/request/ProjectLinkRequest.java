package com.faouzi.portfolio.project.api.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ProjectLinkRequest(
        @NotBlank @Size(max = 120) String label,
        @NotBlank @Size(max = 500) String url,
        @PositiveOrZero int displayOrder
) {
}
