package com.faouzi.portfolio.skills.api.dto.request;

import java.util.List;

import com.faouzi.portfolio.profile.domain.model.PublicationStatus;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SkillCategoryRequest(
        @NotNull
        PublicationStatus publicationStatus,

        @Size(max = 80)
        String icon,

        @Min(0)
        int displayOrder,

        @Valid
        @Size(min = 1)
        List<SkillCategoryTranslationRequest> translations
) {
}
