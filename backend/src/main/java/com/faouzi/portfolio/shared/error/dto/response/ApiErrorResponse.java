package com.faouzi.portfolio.shared.error.dto.response;

import java.time.Instant;
import java.util.List;

public record ApiErrorResponse(
        String code,
        String message,
        List<String> details,
        String traceId,
        Instant timestamp
) {
}
