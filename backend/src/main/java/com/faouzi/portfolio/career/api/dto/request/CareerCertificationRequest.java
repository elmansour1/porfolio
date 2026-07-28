package com.faouzi.portfolio.career.api.dto.request;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.faouzi.portfolio.profile.domain.model.PublicationStatus;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CareerCertificationRequest(
        @NotNull PublicationStatus publicationStatus,
        @NotBlank @Size(max = 180) String issuer,
        @NotNull LocalDate issueDate,
        LocalDate expiryDate,
        boolean noExpiry,
        @Size(max = 180) String credentialId,
        @Size(max = 500) String verificationUrl,
        UUID documentMediaId,
        @PositiveOrZero int displayOrder,
        @Valid List<CareerCertificationTranslationRequest> translations
) {
}
