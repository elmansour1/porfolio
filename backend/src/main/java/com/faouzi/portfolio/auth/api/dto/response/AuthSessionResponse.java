package com.faouzi.portfolio.auth.api.dto.response;

import java.util.UUID;

import com.faouzi.portfolio.auth.application.dto.AuthenticatedAdmin;

public record AuthSessionResponse(
        UUID id,
        String email,
        boolean passwordChangeRequired
) {

    public static AuthSessionResponse from(AuthenticatedAdmin admin) {
        return new AuthSessionResponse(admin.id(), admin.email(), admin.passwordChangeRequired());
    }
}
