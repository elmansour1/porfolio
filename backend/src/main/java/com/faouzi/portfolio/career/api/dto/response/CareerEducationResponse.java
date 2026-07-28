package com.faouzi.portfolio.career.api.dto.response;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.career.domain.model.EducationLevel;
import com.faouzi.portfolio.profile.domain.model.PublicationStatus;

public record CareerEducationResponse(
        UUID id,
        PublicationStatus publicationStatus,
        String institution,
        EducationLevel educationLevel,
        String location,
        LocalDate startDate,
        LocalDate endDate,
        boolean currentEducation,
        String url,
        UUID logoMediaId,
        int displayOrder,
        Instant createdAt,
        Instant updatedAt,
        List<CareerEducationTranslationResponse> translations
) {
}
