package com.faouzi.portfolio.auth.application;

import java.time.Instant;

public record PasswordResetRequestResult(
        String message,
        String resetToken,
        Instant expiresAt
) {
}
