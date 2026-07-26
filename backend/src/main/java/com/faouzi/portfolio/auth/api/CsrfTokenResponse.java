package com.faouzi.portfolio.auth.api;

public record CsrfTokenResponse(
        String headerName,
        String parameterName,
        String token
) {
}
