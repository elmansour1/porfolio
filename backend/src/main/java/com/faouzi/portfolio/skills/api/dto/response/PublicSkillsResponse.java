package com.faouzi.portfolio.skills.api.dto.response;

import java.util.List;

public record PublicSkillsResponse(
        String language,
        List<PublicSkillCategoryResponse> categories,
        List<PublicSkillResponse> featuredSkills
) {
    public record PublicSkillCategoryResponse(
            String name,
            String description,
            String icon,
            int displayOrder,
            List<PublicSkillResponse> skills
    ) {
    }

    public record PublicSkillResponse(
            String name,
            String description,
            String usageSummary,
            String level,
            String icon,
            boolean featured,
            int displayOrder
    ) {
    }
}
