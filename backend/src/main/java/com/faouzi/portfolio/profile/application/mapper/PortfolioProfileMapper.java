package com.faouzi.portfolio.profile.application.mapper;

import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.profile.api.dto.response.AdminProfileResponse;
import com.faouzi.portfolio.profile.api.dto.response.AdminSiteSettingsResponse;
import com.faouzi.portfolio.profile.api.dto.response.ProfessionalLinkResponse;
import com.faouzi.portfolio.profile.api.dto.response.ProfessionalStatisticResponse;
import com.faouzi.portfolio.profile.api.dto.response.ProfileMediaResponse;
import com.faouzi.portfolio.profile.api.dto.response.ProfileTranslationResponse;
import com.faouzi.portfolio.profile.api.dto.response.PublicPortfolioResponse;
import com.faouzi.portfolio.profile.api.dto.response.SectionSettingResponse;
import com.faouzi.portfolio.profile.domain.model.PortfolioSectionSetting;
import com.faouzi.portfolio.profile.domain.model.ProfessionalLink;
import com.faouzi.portfolio.profile.domain.model.ProfessionalProfile;
import com.faouzi.portfolio.profile.domain.model.ProfessionalProfileTranslation;
import com.faouzi.portfolio.profile.domain.model.ProfessionalStatistic;
import com.faouzi.portfolio.profile.domain.model.ProfileMedia;
import com.faouzi.portfolio.profile.domain.model.SiteSettings;
import com.faouzi.portfolio.profile.infrastructure.persistence.PortfolioSectionSettingRepository;
import com.faouzi.portfolio.profile.infrastructure.persistence.ProfessionalLinkRepository;
import com.faouzi.portfolio.profile.infrastructure.persistence.ProfessionalProfileTranslationRepository;
import com.faouzi.portfolio.profile.infrastructure.persistence.ProfessionalStatisticRepository;
import com.faouzi.portfolio.profile.infrastructure.persistence.ProfileMediaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PortfolioProfileMapper {

    private static final UUID EMPTY_MEDIA_ID = new UUID(0L, 0L);

    private final ProfessionalProfileTranslationRepository translations;
    private final ProfessionalLinkRepository links;
    private final ProfessionalStatisticRepository statistics;
    private final ProfileMediaRepository media;
    private final PortfolioSectionSettingRepository sections;

    public AdminProfileResponse toAdminProfileResponse(ProfessionalProfile profile) {
        return new AdminProfileResponse(
                profile.getId(),
                profile.getPublicationStatus(),
                profile.getFirstName(),
                profile.getLastName(),
                profile.getDisplayName(),
                profile.getLocation(),
                profile.getCountry(),
                profile.getAvailabilityStatus(),
                profile.getProfessionalEmail(),
                profile.getPhone(),
                profile.isShowEmail(),
                profile.isShowPhone(),
                profile.isShowPhoto(),
                profile.isShowCv(),
                profile.isShowLinks(),
                profile.isShowStatistics(),
                mediaResponse(profile.getPhotoMediaId(), "/api/v1/admin/profile/photo"),
                mediaResponse(profile.getCvMediaId(), "/api/v1/admin/profile/cv"),
                translations.findByProfileIdOrderByLanguageCode(profile.getId()).stream()
                        .map(this::toTranslationResponse)
                        .toList(),
                links.findByProfileIdOrderByDisplayOrderAscLabelAsc(profile.getId()).stream()
                        .map(this::toLinkResponse)
                        .toList(),
                statistics.findByProfileIdOrderByDisplayOrderAscLabelFrAsc(profile.getId()).stream()
                        .map(this::toStatisticResponse)
                        .toList()
        );
    }

    public AdminSiteSettingsResponse toAdminSettingsResponse(SiteSettings siteSettings, List<String> activeLanguages) {
        return new AdminSiteSettingsResponse(
                siteSettings.getId(),
                siteSettings.getPublicSiteName(),
                siteSettings.getMonogram(),
                siteSettings.getDefaultLanguage(),
                activeLanguages,
                siteSettings.getContactRecipientEmail(),
                siteSettings.getFooterCopyright(),
                siteSettings.isShowCvDownload(),
                siteSettings.isShowContactDetails(),
                siteSettings.isShowSocialLinks(),
                siteSettings.isMaintenanceMode(),
                mediaResponse(siteSettings.getLogoMediaId(), "/api/v1/admin/settings/logo"),
                mediaResponse(siteSettings.getFaviconMediaId(), "/api/v1/admin/settings/favicon"),
                sections.findAllByOrderByDisplayOrderAsc().stream().map(this::toSectionResponse).toList()
        );
    }

    public PublicPortfolioResponse.PublicSiteSettings publicSettings(SiteSettings siteSettings, List<String> activeLanguages) {
        return new PublicPortfolioResponse.PublicSiteSettings(
                siteSettings.getPublicSiteName(),
                siteSettings.getMonogram(),
                siteSettings.getDefaultLanguage(),
                activeLanguages,
                siteSettings.getFooterCopyright(),
                siteSettings.isMaintenanceMode(),
                siteSettings.getLogoMediaId() == null ? null : "/api/v1/public/settings/logo",
                siteSettings.getFaviconMediaId() == null ? null : "/api/v1/public/settings/favicon"
        );
    }

    public PublicPortfolioResponse.PublicProfile toPublicProfile(
            ProfessionalProfile profile,
            ProfessionalProfileTranslation translation,
            SiteSettings siteSettings,
            String language
    ) {
        boolean contactDetailsVisible = siteSettings.isShowContactDetails();
        return new PublicPortfolioResponse.PublicProfile(
                profile.getDisplayName(),
                profile.getFirstName(),
                profile.getLastName(),
                profile.getLocation(),
                profile.getCountry(),
                profile.getAvailabilityStatus(),
                translation.getAvailabilityLabel(),
                translation.getProfessionalTitle(),
                translation.getTagline(),
                translation.getShortSummary(),
                translation.getBiography(),
                translation.getAboutText(),
                contactDetailsVisible && profile.isShowEmail() ? profile.getProfessionalEmail() : null,
                contactDetailsVisible && profile.isShowPhone() ? profile.getPhone() : null,
                profile.isShowPhoto() && profile.getPhotoMediaId() != null ? "/api/v1/public/profile/photo" : null,
                media.findById(profile.getPhotoMediaId() == null ? EMPTY_MEDIA_ID : profile.getPhotoMediaId())
                        .map(ProfileMedia::getAltText)
                        .orElse(null),
                profile.isShowCv() && siteSettings.isShowCvDownload() && profile.getCvMediaId() != null ? "/api/v1/public/profile/cv" : null,
                translation.getPrimaryCtaLabel(),
                translation.getPrimaryCtaUrl(),
                translation.getSecondaryCtaLabel(),
                translation.getSecondaryCtaUrl(),
                translation.getFooterText(),
                publicLinks(profile, siteSettings),
                publicStatistics(profile, language)
        );
    }

    public ProfileMediaResponse mediaResponse(UUID mediaId, String url) {
        if (mediaId == null) {
            return null;
        }
        return media.findById(mediaId)
                .map(storedMedia -> new ProfileMediaResponse(
                        storedMedia.getId(),
                        storedMedia.getOriginalFilename(),
                        storedMedia.getContentType(),
                        storedMedia.getSizeBytes(),
                        storedMedia.getAltText(),
                        url
                ))
                .orElse(null);
    }

    public SectionSettingResponse toSectionResponse(PortfolioSectionSetting section) {
        return new SectionSettingResponse(section.getSectionKey(), section.getLabel(), section.getDisplayOrder(), section.isVisible());
    }

    private ProfileTranslationResponse toTranslationResponse(ProfessionalProfileTranslation translation) {
        return new ProfileTranslationResponse(
                translation.getLanguageCode(),
                translation.getProfessionalTitle(),
                translation.getTagline(),
                translation.getShortSummary(),
                translation.getBiography(),
                translation.getAboutText(),
                translation.getAvailabilityLabel(),
                translation.getPrimaryCtaLabel(),
                translation.getPrimaryCtaUrl(),
                translation.getSecondaryCtaLabel(),
                translation.getSecondaryCtaUrl(),
                translation.getFooterText()
        );
    }

    private ProfessionalLinkResponse toLinkResponse(ProfessionalLink link) {
        return new ProfessionalLinkResponse(
                link.getId(),
                link.getType(),
                link.getLabel(),
                link.getUrl(),
                link.getIcon(),
                link.getDisplayOrder(),
                link.isVisible(),
                link.isOpenInNewTab()
        );
    }

    private ProfessionalStatisticResponse toStatisticResponse(ProfessionalStatistic statistic) {
        return new ProfessionalStatisticResponse(
                statistic.getId(),
                statistic.getValue(),
                statistic.getLabelFr(),
                statistic.getLabelEn(),
                statistic.getDisplayOrder(),
                statistic.isVisible()
        );
    }

    private List<PublicPortfolioResponse.PublicLink> publicLinks(ProfessionalProfile profile, SiteSettings siteSettings) {
        if (!profile.isShowLinks() || !siteSettings.isShowSocialLinks()) {
            return List.of();
        }
        return links.findByProfileIdOrderByDisplayOrderAscLabelAsc(profile.getId())
                .stream()
                .filter(ProfessionalLink::isVisible)
                .map(link -> new PublicPortfolioResponse.PublicLink(
                        link.getType().name(),
                        link.getLabel(),
                        link.getUrl(),
                        link.getIcon(),
                        link.isOpenInNewTab()
                ))
                .toList();
    }

    private List<PublicPortfolioResponse.PublicStatistic> publicStatistics(ProfessionalProfile profile, String language) {
        if (!profile.isShowStatistics()) {
            return List.of();
        }
        return statistics.findByProfileIdOrderByDisplayOrderAscLabelFrAsc(profile.getId())
                .stream()
                .filter(ProfessionalStatistic::isVisible)
                .map(statistic -> new PublicPortfolioResponse.PublicStatistic(
                        statistic.getValue(),
                        "en".equals(language) ? statistic.getLabelEn() : statistic.getLabelFr()
                ))
                .toList();
    }
}
