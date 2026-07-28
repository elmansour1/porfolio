package com.faouzi.portfolio.profile.api.dto.response;

import java.util.List;

import com.faouzi.portfolio.profile.domain.model.AvailabilityStatus;

public record PublicPortfolioResponse(
        boolean profilePublished,
        String language,
        PublicSiteSettings settings,
        PublicProfile profile,
        List<SectionSettingResponse> sections
) {
    public record PublicSiteSettings(
            String publicSiteName,
            String monogram,
            String defaultLanguage,
            List<String> activeLanguages,
            String footerCopyright,
            boolean maintenanceMode,
            String logoUrl,
            String faviconUrl
    ) {
    }

    public record PublicProfile(
            String displayName,
            String firstName,
            String lastName,
            String location,
            String country,
            AvailabilityStatus availabilityStatus,
            String availabilityLabel,
            String professionalTitle,
            String tagline,
            String shortSummary,
            String biography,
            String aboutText,
            String professionalEmail,
            String phone,
            String photoUrl,
            String photoAltText,
            String cvUrl,
            String primaryCtaLabel,
            String primaryCtaUrl,
            String secondaryCtaLabel,
            String secondaryCtaUrl,
            String footerText,
            List<PublicLink> links,
            List<PublicStatistic> statistics
    ) {
    }

    public record PublicLink(
            String type,
            String label,
            String url,
            String icon,
            boolean openInNewTab
    ) {
    }

    public record PublicStatistic(
            String value,
            String label
    ) {
    }
}
