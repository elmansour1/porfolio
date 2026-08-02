package com.faouzi.portfolio.project.api.dto.response;

import java.time.LocalDate;
import java.util.List;

public record PublicProjectResponse(
        String slug,
        String projectType,
        String realStatus,
        LocalDate startDate,
        LocalDate endDate,
        boolean ongoing,
        String title,
        String summary,
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
        String seoTitle,
        String seoDescription,
        String coverUrl,
        List<ProjectMediaResponse> gallery,
        List<ProjectSkillReferenceResponse> skills,
        List<ProjectLinkResponse> links,
        String demoUrl,
        String githubUrl,
        List<PublicProjectSummaryResponse> similarProjects
) {
}
