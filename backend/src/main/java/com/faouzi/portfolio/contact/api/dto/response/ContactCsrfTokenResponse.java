package com.faouzi.portfolio.contact.api.dto.response;

public record ContactCsrfTokenResponse(
        String headerName,
        String parameterName,
        String token
) {
}
