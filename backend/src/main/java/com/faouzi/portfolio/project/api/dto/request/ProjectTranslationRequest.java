package com.faouzi.portfolio.project.api.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ProjectTranslationRequest(
        @NotBlank @Pattern(regexp = "fr|en") String languageCode,
        @Size(max = 220) String title,
        @Size(max = 800) String summary,
        String description,
        String context,
        String problem,
        String objectives,
        String targetUsers,
        String role,
        String responsibilities,
        String solution,
        String architectureNotes,
        String features,
        String challenges,
        String decisions,
        String results,
        @Size(max = 70) String seoTitle,
        @Size(max = 160) String seoDescription
) {
}
