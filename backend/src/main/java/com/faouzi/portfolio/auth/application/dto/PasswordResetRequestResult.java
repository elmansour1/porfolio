package com.faouzi.portfolio.auth.application.dto;

import java.time.Instant;

public record PasswordResetRequestResult(
        String message,
        String resetToken,
        Instant expiresAt
) {
}
