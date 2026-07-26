package com.faouzi.portfolio.profile.api;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.faouzi.portfolio.profile.domain.AvailabilityStatus;
import com.faouzi.portfolio.profile.domain.PublicationStatus;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@JsonIgnoreProperties(ignoreUnknown = true)
public record AdminProfileRequest(
        @NotNull PublicationStatus publicationStatus,
        @NotBlank @Size(max = 120) String firstName,
        @NotBlank @Size(max = 120) String lastName,
        @NotBlank @Size(max = 180) String displayName,
        @Size(max = 180) String location,
        @Size(max = 120) String country,
        @NotNull AvailabilityStatus availabilityStatus,
        @Email @Size(max = 320) String professionalEmail,
        @Size(max = 60) String phone,
        boolean showEmail,
        boolean showPhone,
        boolean showPhoto,
        boolean showCv,
        boolean showLinks,
        boolean showStatistics,
        @Valid List<ProfileTranslationRequest> translations,
        @Valid List<ProfessionalLinkRequest> links,
        @Valid List<ProfessionalStatisticRequest> statistics
) {
}
