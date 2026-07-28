package com.faouzi.portfolio.skills.api.dto.request;

import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.profile.domain.model.PublicationStatus;
import com.faouzi.portfolio.skills.domain.model.SkillLevel;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SkillRequest(
        @NotNull
        UUID categoryId,

        @NotNull
        PublicationStatus publicationStatus,

        SkillLevel level,

        @Size(max = 80)
        String icon,

        boolean featured,

        boolean visible,

        @Min(0)
        int displayOrder,

        @Valid
        @Size(min = 1)
        List<SkillTranslationRequest> translations
) {
}
