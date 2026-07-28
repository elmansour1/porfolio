package com.faouzi.portfolio.profile.api.dto.response;

import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.profile.domain.model.AvailabilityStatus;
import com.faouzi.portfolio.profile.domain.model.PublicationStatus;

public record AdminProfileResponse(
        UUID id,
        PublicationStatus publicationStatus,
        String firstName,
        String lastName,
        String displayName,
        String location,
        String country,
        AvailabilityStatus availabilityStatus,
        String professionalEmail,
        String phone,
        boolean showEmail,
        boolean showPhone,
        boolean showPhoto,
        boolean showCv,
        boolean showLinks,
        boolean showStatistics,
        ProfileMediaResponse photo,
        ProfileMediaResponse cv,
        List<ProfileTranslationResponse> translations,
        List<ProfessionalLinkResponse> links,
        List<ProfessionalStatisticResponse> statistics
) {
}
