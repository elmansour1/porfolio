package com.faouzi.portfolio.profile.api.dto.response;

import java.util.List;
import java.util.UUID;

public record AdminSiteSettingsResponse(
        UUID id,
        String publicSiteName,
        String monogram,
        String defaultLanguage,
        List<String> activeLanguages,
        String contactRecipientEmail,
        String footerCopyright,
        boolean showCvDownload,
        boolean showContactDetails,
        boolean showSocialLinks,
        boolean maintenanceMode,
        ProfileMediaResponse logo,
        ProfileMediaResponse favicon,
        List<SectionSettingResponse> sections
) {
}
