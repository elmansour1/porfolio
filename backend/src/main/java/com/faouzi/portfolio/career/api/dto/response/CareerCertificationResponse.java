package com.faouzi.portfolio.career.api.dto.response;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.profile.domain.model.PublicationStatus;

public record CareerCertificationResponse(
        UUID id,
        PublicationStatus publicationStatus,
        String issuer,
        LocalDate issueDate,
        LocalDate expiryDate,
        boolean noExpiry,
        String credentialId,
        String verificationUrl,
        UUID documentMediaId,
        int displayOrder,
        Instant createdAt,
        Instant updatedAt,
        List<CareerCertificationTranslationResponse> translations
) {
}
