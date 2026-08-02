package com.faouzi.portfolio.project.api.dto.response;

import java.time.LocalDate;
import java.util.List;

public record PublicProjectSummaryResponse(
        String slug,
        String projectType,
        String realStatus,
        String title,
        String summary,
        String coverUrl,
        LocalDate startDate,
        LocalDate endDate,
        boolean ongoing,
        boolean featured,
        List<ProjectSkillReferenceResponse> skills
) {
}
