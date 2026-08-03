package com.faouzi.portfolio.service.api.dto.response;

import java.util.UUID;

public record ServiceReferenceResponse(
        UUID id,
        String name,
        String categoryName
) {
}
