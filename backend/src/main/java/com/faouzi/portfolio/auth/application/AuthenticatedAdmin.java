package com.faouzi.portfolio.auth.application;

import java.util.UUID;

public record AuthenticatedAdmin(
        UUID id,
        String email,
        boolean passwordChangeRequired
) {
}
