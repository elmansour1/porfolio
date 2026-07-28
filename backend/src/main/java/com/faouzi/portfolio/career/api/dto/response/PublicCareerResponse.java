package com.faouzi.portfolio.career.api.dto.response;

import java.time.LocalDate;
import java.util.List;

public record PublicCareerResponse(
        String language,
        List<PublicExperienceResponse> experiences,
        List<PublicEducationResponse> education,
        List<PublicCertificationResponse> certifications
) {

    public record PublicExperienceResponse(
            String experienceType,
            String contractType,
            String organization,
            String roleTitle,
            String location,
            String workMode,
            LocalDate startDate,
            LocalDate endDate,
            boolean currentPosition,
            boolean confidential,
            String summary,
            String missions,
            String achievements,
            String organizationUrl,
            int displayOrder,
            List<CareerSkillReferenceResponse> skills
    ) {
    }

    public record PublicEducationResponse(
            String institution,
            String educationLevel,
            String location,
            LocalDate startDate,
            LocalDate endDate,
            boolean currentEducation,
            String title,
            String field,
            String description,
            String url,
            int displayOrder
    ) {
    }

    public record PublicCertificationResponse(
            String issuer,
            LocalDate issueDate,
            LocalDate expiryDate,
            boolean noExpiry,
            String credentialId,
            String verificationUrl,
            String name,
            String description,
            int displayOrder
    ) {
    }
}
