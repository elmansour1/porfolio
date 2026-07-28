package com.faouzi.portfolio.profile.api.dto.request;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@JsonIgnoreProperties(ignoreUnknown = true)
public record AdminSiteSettingsRequest(
        @NotBlank @Size(max = 180) String publicSiteName,
        @NotBlank @Size(max = 12) String monogram,
        @Pattern(regexp = "fr|en") String defaultLanguage,
        @NotEmpty List<@Pattern(regexp = "fr|en") String> activeLanguages,
        @Email @Size(max = 320) String contactRecipientEmail,
        @Size(max = 240) String footerCopyright,
        boolean showCvDownload,
        boolean showContactDetails,
        boolean showSocialLinks,
        boolean maintenanceMode,
        @Valid List<SectionSettingRequest> sections
) {
}
