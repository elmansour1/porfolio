package com.faouzi.portfolio.project.api.dto.response;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.profile.domain.model.PublicationStatus;
import com.faouzi.portfolio.project.domain.model.ProjectConfidentiality;
import com.faouzi.portfolio.project.domain.model.ProjectRealStatus;
import com.faouzi.portfolio.project.domain.model.ProjectType;

public record ProjectResponse(
        UUID id,
        String slug,
        ProjectType projectType,
        ProjectRealStatus realStatus,
        PublicationStatus publicationStatus,
        ProjectConfidentiality confidentiality,
        LocalDate startDate,
        LocalDate endDate,
        boolean ongoing,
        boolean featured,
        int displayOrder,
        String demoUrl,
        String githubUrl,
        boolean indexable,
        Instant createdAt,
        Instant updatedAt,
        List<ProjectTranslationResponse> translations,
        List<ProjectSkillReferenceResponse> skills,
        List<ProjectLinkResponse> links,
        List<ProjectMediaResponse> media
) {
}
