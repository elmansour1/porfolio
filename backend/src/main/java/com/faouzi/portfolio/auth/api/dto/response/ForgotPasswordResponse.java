package com.faouzi.portfolio.auth.api.dto.response;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.faouzi.portfolio.auth.application.dto.PasswordResetRequestResult;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ForgotPasswordResponse(
        String message,
        String resetToken,
        Instant expiresAt
) {

    public static ForgotPasswordResponse from(PasswordResetRequestResult result) {
        return new ForgotPasswordResponse(result.message(), result.resetToken(), result.expiresAt());
    }
}
