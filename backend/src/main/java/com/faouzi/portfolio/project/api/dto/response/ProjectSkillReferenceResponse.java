package com.faouzi.portfolio.project.api.dto.response;

import java.util.UUID;

public record ProjectSkillReferenceResponse(
        UUID id,
        String name,
        String categoryName
) {
}
