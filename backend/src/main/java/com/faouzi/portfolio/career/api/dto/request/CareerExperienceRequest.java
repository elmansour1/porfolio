package com.faouzi.portfolio.career.api.dto.request;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.faouzi.portfolio.career.domain.model.ContractType;
import com.faouzi.portfolio.career.domain.model.ExperienceType;
import com.faouzi.portfolio.career.domain.model.WorkMode;
import com.faouzi.portfolio.profile.domain.model.PublicationStatus;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CareerExperienceRequest(
        @NotNull PublicationStatus publicationStatus,
        @NotNull ExperienceType experienceType,
        ContractType contractType,
        @Size(max = 180) String organization,
        @NotBlank @Size(max = 180) String roleTitle,
        @Size(max = 180) String location,
        @NotNull WorkMode workMode,
        @NotNull LocalDate startDate,
        LocalDate endDate,
        boolean currentPosition,
        boolean confidential,
        @Size(max = 500) String organizationUrl,
        UUID logoMediaId,
        @PositiveOrZero int displayOrder,
        @Valid List<CareerExperienceTranslationRequest> translations,
        List<UUID> skillIds
) {
}
