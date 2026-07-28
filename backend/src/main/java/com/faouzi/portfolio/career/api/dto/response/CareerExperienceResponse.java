package com.faouzi.portfolio.career.api.dto.response;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.career.domain.model.ContractType;
import com.faouzi.portfolio.career.domain.model.ExperienceType;
import com.faouzi.portfolio.career.domain.model.WorkMode;
import com.faouzi.portfolio.profile.domain.model.PublicationStatus;

public record CareerExperienceResponse(
        UUID id,
        PublicationStatus publicationStatus,
        ExperienceType experienceType,
        ContractType contractType,
        String organization,
        String roleTitle,
        String location,
        WorkMode workMode,
        LocalDate startDate,
        LocalDate endDate,
        boolean currentPosition,
        boolean confidential,
        String organizationUrl,
        UUID logoMediaId,
        int displayOrder,
        Instant createdAt,
        Instant updatedAt,
        List<CareerExperienceTranslationResponse> translations,
        List<CareerSkillReferenceResponse> skills
) {
}
