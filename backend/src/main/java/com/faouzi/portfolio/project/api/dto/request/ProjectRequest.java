package com.faouzi.portfolio.project.api.dto.request;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.faouzi.portfolio.profile.domain.model.PublicationStatus;
import com.faouzi.portfolio.project.domain.model.ProjectConfidentiality;
import com.faouzi.portfolio.project.domain.model.ProjectRealStatus;
import com.faouzi.portfolio.project.domain.model.ProjectType;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ProjectRequest(
        @NotBlank @Size(max = 160) String slug,
        @NotNull ProjectType projectType,
        @NotNull ProjectRealStatus realStatus,
        @NotNull PublicationStatus publicationStatus,
        @NotNull ProjectConfidentiality confidentiality,
        LocalDate startDate,
        LocalDate endDate,
        boolean ongoing,
        boolean featured,
        @PositiveOrZero int displayOrder,
        @Size(max = 500) String demoUrl,
        @Size(max = 500) String githubUrl,
        boolean indexable,
        @Valid List<ProjectTranslationRequest> translations,
        List<UUID> skillIds,
        @Valid List<ProjectLinkRequest> links
) {
}
