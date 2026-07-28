package com.faouzi.portfolio.auth.api.dto.response;

public record CsrfTokenResponse(
        String headerName,
        String parameterName,
        String token
) {
}
