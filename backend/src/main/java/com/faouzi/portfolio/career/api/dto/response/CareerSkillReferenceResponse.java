package com.faouzi.portfolio.career.api.dto.response;

import java.util.UUID;

public record CareerSkillReferenceResponse(
        UUID id,
        String name,
        String categoryName
) {
}
