package com.faouzi.portfolio.career.api.dto.request;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.faouzi.portfolio.career.domain.model.EducationLevel;
import com.faouzi.portfolio.profile.domain.model.PublicationStatus;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CareerEducationRequest(
        @NotNull PublicationStatus publicationStatus,
        @NotBlank @Size(max = 180) String institution,
        EducationLevel educationLevel,
        @Size(max = 180) String location,
        @NotNull LocalDate startDate,
        LocalDate endDate,
        boolean currentEducation,
        @Size(max = 500) String url,
        UUID logoMediaId,
        @PositiveOrZero int displayOrder,
        @Valid List<CareerEducationTranslationRequest> translations
) {
}
