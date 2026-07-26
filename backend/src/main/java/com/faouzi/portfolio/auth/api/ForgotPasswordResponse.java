package com.faouzi.portfolio.auth.api;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.faouzi.portfolio.auth.application.PasswordResetRequestResult;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ForgotPasswordResponse(
        String message,
        String resetToken,
        Instant expiresAt
) {

    static ForgotPasswordResponse from(PasswordResetRequestResult result) {
        return new ForgotPasswordResponse(result.message(), result.resetToken(), result.expiresAt());
    }
}
