package com.faouzi.portfolio.auth.api;

import java.util.UUID;

import com.faouzi.portfolio.auth.application.AuthenticatedAdmin;

public record AuthSessionResponse(
        UUID id,
        String email,
        boolean passwordChangeRequired
) {

    static AuthSessionResponse from(AuthenticatedAdmin admin) {
        return new AuthSessionResponse(admin.id(), admin.email(), admin.passwordChangeRequired());
    }
}
