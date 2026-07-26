package com.faouzi.portfolio.profile.application;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.Clock;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import com.faouzi.portfolio.audit.application.ActivityLogService;
import com.faouzi.portfolio.auth.domain.AdminUser;
import com.faouzi.portfolio.auth.domain.AdminUserRepository;
import com.faouzi.portfolio.profile.api.AdminProfileRequest;
import com.faouzi.portfolio.profile.api.AdminProfileResponse;
import com.faouzi.portfolio.profile.api.AdminSiteSettingsRequest;
import com.faouzi.portfolio.profile.api.AdminSiteSettingsResponse;
import com.faouzi.portfolio.profile.api.ProfessionalLinkRequest;
import com.faouzi.portfolio.profile.api.ProfessionalLinkResponse;
import com.faouzi.portfolio.profile.api.ProfessionalStatisticRequest;
import com.faouzi.portfolio.profile.api.ProfessionalStatisticResponse;
import com.faouzi.portfolio.profile.api.ProfileMediaResponse;
import com.faouzi.portfolio.profile.api.ProfileTranslationRequest;
import com.faouzi.portfolio.profile.api.ProfileTranslationResponse;
import com.faouzi.portfolio.profile.api.PublicPortfolioResponse;
import com.faouzi.portfolio.profile.api.SectionSettingRequest;
import com.faouzi.portfolio.profile.api.SectionSettingResponse;
import com.faouzi.portfolio.profile.domain.PortfolioSectionSetting;
import com.faouzi.portfolio.profile.domain.PortfolioSectionSettingRepository;
import com.faouzi.portfolio.profile.domain.ProfessionalLink;
import com.faouzi.portfolio.profile.domain.ProfessionalLinkRepository;
import com.faouzi.portfolio.profile.domain.ProfessionalProfile;
import com.faouzi.portfolio.profile.domain.ProfessionalProfileRepository;
import com.faouzi.portfolio.profile.domain.ProfessionalProfileTranslation;
import com.faouzi.portfolio.profile.domain.ProfessionalProfileTranslationRepository;
import com.faouzi.portfolio.profile.domain.ProfessionalStatistic;
import com.faouzi.portfolio.profile.domain.ProfessionalStatisticRepository;
import com.faouzi.portfolio.profile.domain.ProfileMedia;
import com.faouzi.portfolio.profile.domain.ProfileMediaKind;
import com.faouzi.portfolio.profile.domain.ProfileMediaRepository;
import com.faouzi.portfolio.profile.domain.ProfileTranslationValues;
import com.faouzi.portfolio.profile.domain.PublicationStatus;
import com.faouzi.portfolio.profile.domain.SiteSettings;
import com.faouzi.portfolio.profile.domain.SiteSettingsRepository;
import com.faouzi.portfolio.shared.error.ApiException;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PortfolioProfileService {

    private static final List<SectionSeed> SECTION_SEEDS = List.of(
            new SectionSeed("HERO", "Hero", 10, true),
            new SectionSeed("ABOUT", "À propos", 20, true),
            new SectionSeed("SKILLS", "Compétences", 30, true),
            new SectionSeed("EXPERIENCES", "Expériences", 40, true),
            new SectionSeed("EDUCATION", "Formations", 50, true),
            new SectionSeed("PROJECTS", "Projets", 60, true),
            new SectionSeed("SERVICES", "Services", 70, true),
            new SectionSeed("METHOD", "Méthode", 80, true),
            new SectionSeed("TESTIMONIALS", "Témoignages", 90, false),
            new SectionSeed("CONTACT", "Contact", 100, true)
    );

    private final ProfessionalProfileRepository profiles;
    private final ProfessionalProfileTranslationRepository translations;
    private final ProfessionalLinkRepository links;
    private final ProfessionalStatisticRepository statistics;
    private final ProfileMediaRepository media;
    private final SiteSettingsRepository settings;
    private final PortfolioSectionSettingRepository sections;
    private final ProfileMediaStorageService mediaStorage;
    private final AdminUserRepository adminUsers;
    private final ActivityLogService activityLog;
    private final Clock clock;

    public PortfolioProfileService(
            ProfessionalProfileRepository profiles,
            ProfessionalProfileTranslationRepository translations,
            ProfessionalLinkRepository links,
            ProfessionalStatisticRepository statistics,
            ProfileMediaRepository media,
            SiteSettingsRepository settings,
            PortfolioSectionSettingRepository sections,
            ProfileMediaStorageService mediaStorage,
            AdminUserRepository adminUsers,
            ActivityLogService activityLog,
            Clock clock
    ) {
        this.profiles = profiles;
        this.translations = translations;
        this.links = links;
        this.statistics = statistics;
        this.media = media;
        this.settings = settings;
        this.sections = sections;
        this.mediaStorage = mediaStorage;
        this.adminUsers = adminUsers;
        this.activityLog = activityLog;
        this.clock = clock;
    }

    @Transactional
    public AdminProfileResponse adminProfile() {
        return toAdminProfileResponse(ensureProfile());
    }

    @Transactional
    public AdminProfileResponse updateProfile(AdminProfileRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        validateProfileRequest(request);
        ProfessionalProfile profile = ensureProfile();
        profile.update(
                request.publicationStatus(),
                request.firstName(),
                request.lastName(),
                request.displayName(),
                request.location(),
                request.country(),
                request.availabilityStatus(),
                request.professionalEmail(),
                request.phone(),
                request.showEmail(),
                request.showPhone(),
                request.showPhoto(),
                request.showCv(),
                request.showLinks(),
                request.showStatistics(),
                clock.instant()
        );
        profiles.save(profile);
        replaceTranslations(profile.id(), request.translations());
        replaceLinks(profile.id(), request.links());
        replaceStatistics(profile.id(), request.statistics());
        record(authentication, "PROFILE_UPDATED", "professional_profile", profile.id().toString(), httpRequest);
        return toAdminProfileResponse(profile);
    }

    @Transactional
    public AdminProfileResponse uploadProfilePhoto(MultipartFile file, String altText, Authentication authentication, HttpServletRequest request) {
        ProfessionalProfile profile = ensureProfile();
        removeExistingMedia(profile.photoMediaId());
        ProfileMedia stored = mediaStorage.store(file, ProfileMediaKind.PROFILE_PHOTO, altText);
        profile.attachPhoto(stored.id(), clock.instant());
        profiles.save(profile);
        record(authentication, "PROFILE_PHOTO_REPLACED", "profile_media", stored.id().toString(), request);
        return toAdminProfileResponse(profile);
    }

    @Transactional
    public AdminProfileResponse deleteProfilePhoto(Authentication authentication, HttpServletRequest request) {
        ProfessionalProfile profile = ensureProfile();
        removeExistingMedia(profile.photoMediaId());
        profile.removePhoto(clock.instant());
        profiles.save(profile);
        record(authentication, "PROFILE_PHOTO_REMOVED", "professional_profile", profile.id().toString(), request);
        return toAdminProfileResponse(profile);
    }

    @Transactional
    public AdminProfileResponse uploadCv(MultipartFile file, Authentication authentication, HttpServletRequest request) {
        ProfessionalProfile profile = ensureProfile();
        removeExistingMedia(profile.cvMediaId());
        ProfileMedia stored = mediaStorage.store(file, ProfileMediaKind.CV_PDF, null);
        profile.attachCv(stored.id(), clock.instant());
        profiles.save(profile);
        record(authentication, "PROFILE_CV_REPLACED", "profile_media", stored.id().toString(), request);
        return toAdminProfileResponse(profile);
    }

    @Transactional
    public AdminProfileResponse deleteCv(Authentication authentication, HttpServletRequest request) {
        ProfessionalProfile profile = ensureProfile();
        removeExistingMedia(profile.cvMediaId());
        profile.removeCv(clock.instant());
        profiles.save(profile);
        record(authentication, "PROFILE_CV_REMOVED", "professional_profile", profile.id().toString(), request);
        return toAdminProfileResponse(profile);
    }

    @Transactional
    public AdminSiteSettingsResponse adminSettings() {
        return toAdminSettingsResponse(ensureSettings());
    }

    @Transactional
    public AdminSiteSettingsResponse updateSettings(AdminSiteSettingsRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        validateSettingsRequest(request);
        SiteSettings siteSettings = ensureSettings();
        siteSettings.update(
                request.publicSiteName(),
                request.monogram(),
                request.defaultLanguage(),
                String.join(",", normalizedLanguages(request.activeLanguages())),
                request.contactRecipientEmail(),
                request.footerCopyright(),
                request.showCvDownload(),
                request.showContactDetails(),
                request.showSocialLinks(),
                request.maintenanceMode(),
                clock.instant()
        );
        settings.save(siteSettings);
        updateSections(request.sections());
        record(authentication, "SITE_SETTINGS_UPDATED", "site_settings", siteSettings.id().toString(), httpRequest);
        return toAdminSettingsResponse(siteSettings);
    }

    @Transactional
    public AdminSiteSettingsResponse uploadLogo(MultipartFile file, String altText, Authentication authentication, HttpServletRequest request) {
        SiteSettings siteSettings = ensureSettings();
        removeExistingMedia(siteSettings.logoMediaId());
        ProfileMedia stored = mediaStorage.store(file, ProfileMediaKind.SITE_LOGO, altText);
        siteSettings.attachLogo(stored.id(), clock.instant());
        settings.save(siteSettings);
        record(authentication, "SITE_LOGO_REPLACED", "profile_media", stored.id().toString(), request);
        return toAdminSettingsResponse(siteSettings);
    }

    @Transactional
    public AdminSiteSettingsResponse deleteLogo(Authentication authentication, HttpServletRequest request) {
        SiteSettings siteSettings = ensureSettings();
        removeExistingMedia(siteSettings.logoMediaId());
        siteSettings.removeLogo(clock.instant());
        settings.save(siteSettings);
        record(authentication, "SITE_LOGO_REMOVED", "site_settings", siteSettings.id().toString(), request);
        return toAdminSettingsResponse(siteSettings);
    }

    @Transactional
    public AdminSiteSettingsResponse uploadFavicon(MultipartFile file, Authentication authentication, HttpServletRequest request) {
        SiteSettings siteSettings = ensureSettings();
        removeExistingMedia(siteSettings.faviconMediaId());
        ProfileMedia stored = mediaStorage.store(file, ProfileMediaKind.SITE_FAVICON, "Favicon");
        siteSettings.attachFavicon(stored.id(), clock.instant());
        settings.save(siteSettings);
        record(authentication, "SITE_FAVICON_REPLACED", "profile_media", stored.id().toString(), request);
        return toAdminSettingsResponse(siteSettings);
    }

    @Transactional
    public AdminSiteSettingsResponse deleteFavicon(Authentication authentication, HttpServletRequest request) {
        SiteSettings siteSettings = ensureSettings();
        removeExistingMedia(siteSettings.faviconMediaId());
        siteSettings.removeFavicon(clock.instant());
        settings.save(siteSettings);
        record(authentication, "SITE_FAVICON_REMOVED", "site_settings", siteSettings.id().toString(), request);
        return toAdminSettingsResponse(siteSettings);
    }

    @Transactional(readOnly = true)
    public PublicPortfolioResponse publicPortfolio(String language) {
        SiteSettings siteSettings = settings.findAll().stream().findFirst()
                .orElse(new SiteSettings(UUID.randomUUID(), clock.instant()));
        List<String> activeLanguages = parseLanguages(siteSettings.activeLanguages());
        String selectedLanguage = activeLanguages.contains(language) ? language : siteSettings.defaultLanguage();
        List<SectionSettingResponse> sectionResponses = sections.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(this::toSectionResponse)
                .toList();

        Optional<ProfessionalProfile> profile = profiles.findAll().stream().findFirst();
        if (profile.isEmpty() || profile.get().publicationStatus() != PublicationStatus.PUBLISHED) {
            return new PublicPortfolioResponse(false, selectedLanguage, publicSettings(siteSettings), null, sectionResponses);
        }

        Optional<ProfessionalProfileTranslation> translation =
                translations.findByProfileIdAndLanguageCode(profile.get().id(), selectedLanguage);
        if (translation.isEmpty() || !hasPublicTranslation(translation.get())) {
            return new PublicPortfolioResponse(false, selectedLanguage, publicSettings(siteSettings), null, sectionResponses);
        }

        return new PublicPortfolioResponse(
                true,
                selectedLanguage,
                publicSettings(siteSettings),
                toPublicProfile(profile.get(), translation.get(), siteSettings, selectedLanguage),
                sectionResponses
        );
    }

    @Transactional(readOnly = true)
    public ProfileMediaFile readAdminProfilePhoto() {
        return readMedia(ensureProfileReadOnly().photoMediaId());
    }

    @Transactional(readOnly = true)
    public ProfileMediaFile readAdminCv() {
        return readMedia(ensureProfileReadOnly().cvMediaId());
    }

    @Transactional(readOnly = true)
    public ProfileMediaFile readAdminLogo() {
        return readMedia(ensureSettingsReadOnly().logoMediaId());
    }

    @Transactional(readOnly = true)
    public ProfileMediaFile readAdminFavicon() {
        return readMedia(ensureSettingsReadOnly().faviconMediaId());
    }

    @Transactional(readOnly = true)
    public ProfileMediaFile readPublicProfilePhoto() {
        ProfessionalProfile profile = ensurePublishedProfile();
        if (!profile.showPhoto()) {
            throw new ApiException(HttpStatus.NOT_FOUND, "MEDIA_NOT_PUBLIC", "The requested media is not public.");
        }
        return readMedia(profile.photoMediaId());
    }

    @Transactional(readOnly = true)
    public ProfileMediaFile readPublicCv() {
        ProfessionalProfile profile = ensurePublishedProfile();
        SiteSettings siteSettings = ensureSettingsReadOnly();
        if (!profile.showCv() || !siteSettings.showCvDownload()) {
            throw new ApiException(HttpStatus.NOT_FOUND, "MEDIA_NOT_PUBLIC", "The requested media is not public.");
        }
        return readMedia(profile.cvMediaId());
    }

    @Transactional(readOnly = true)
    public ProfileMediaFile readPublicLogo() {
        return readMedia(ensureSettingsReadOnly().logoMediaId());
    }

    @Transactional(readOnly = true)
    public ProfileMediaFile readPublicFavicon() {
        return readMedia(ensureSettingsReadOnly().faviconMediaId());
    }

    private ProfessionalProfile ensureProfile() {
        return profiles.findAll().stream().findFirst()
                .orElseGet(() -> profiles.save(new ProfessionalProfile(UUID.randomUUID(), clock.instant())));
    }

    private ProfessionalProfile ensureProfileReadOnly() {
        return profiles.findAll().stream().findFirst()
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "PROFILE_NOT_FOUND", "No professional profile exists."));
    }

    private ProfessionalProfile ensurePublishedProfile() {
        ProfessionalProfile profile = ensureProfileReadOnly();
        if (profile.publicationStatus() != PublicationStatus.PUBLISHED) {
            throw new ApiException(HttpStatus.NOT_FOUND, "PROFILE_NOT_PUBLIC", "The profile is not public.");
        }
        return profile;
    }

    private SiteSettings ensureSettings() {
        SiteSettings siteSettings = settings.findAll().stream().findFirst()
                .orElseGet(() -> settings.save(new SiteSettings(UUID.randomUUID(), clock.instant())));
        ensureSectionSeeds();
        return siteSettings;
    }

    private SiteSettings ensureSettingsReadOnly() {
        return settings.findAll().stream().findFirst()
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "SETTINGS_NOT_FOUND", "No settings exist."));
    }

    private void ensureSectionSeeds() {
        Set<String> existing = sections.findAll().stream()
                .map(PortfolioSectionSetting::sectionKey)
                .collect(java.util.stream.Collectors.toSet());
        for (SectionSeed seed : SECTION_SEEDS) {
            if (!existing.contains(seed.key())) {
                sections.save(new PortfolioSectionSetting(seed.key(), seed.label(), seed.order(), seed.visible(), clock.instant()));
            }
        }
    }

    private void replaceTranslations(UUID profileId, List<ProfileTranslationRequest> requests) {
        translations.deleteByProfileId(profileId);
        for (ProfileTranslationRequest request : safeList(requests)) {
            ProfessionalProfileTranslation translation =
                    new ProfessionalProfileTranslation(UUID.randomUUID(), profileId, request.languageCode());
            translation.update(new ProfileTranslationValues(
                    request.professionalTitle(),
                    request.tagline(),
                    request.shortSummary(),
                    request.biography(),
                    request.aboutText(),
                    request.availabilityLabel(),
                    request.primaryCtaLabel(),
                    request.primaryCtaUrl(),
                    request.secondaryCtaLabel(),
                    request.secondaryCtaUrl(),
                    request.footerText()
            ));
            translations.save(translation);
        }
    }

    private void replaceLinks(UUID profileId, List<ProfessionalLinkRequest> requests) {
        links.deleteByProfileId(profileId);
        for (ProfessionalLinkRequest request : safeList(requests)) {
            links.save(new ProfessionalLink(
                    UUID.randomUUID(),
                    profileId,
                    request.type(),
                    request.label(),
                    request.url(),
                    request.icon(),
                    request.displayOrder(),
                    request.visible(),
                    request.openInNewTab()
            ));
        }
    }

    private void replaceStatistics(UUID profileId, List<ProfessionalStatisticRequest> requests) {
        statistics.deleteByProfileId(profileId);
        for (ProfessionalStatisticRequest request : safeList(requests)) {
            statistics.save(new ProfessionalStatistic(
                    UUID.randomUUID(),
                    profileId,
                    request.value(),
                    request.labelFr(),
                    request.labelEn(),
                    request.displayOrder(),
                    request.visible()
            ));
        }
    }

    private void updateSections(List<SectionSettingRequest> requests) {
        ensureSectionSeeds();
        for (SectionSettingRequest request : safeList(requests)) {
            PortfolioSectionSetting section = sections.findById(request.sectionKey())
                    .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "SECTION_UNKNOWN", "Unknown portfolio section."));
            section.update(request.visible(), request.displayOrder(), clock.instant());
            sections.save(section);
        }
    }

    private AdminProfileResponse toAdminProfileResponse(ProfessionalProfile profile) {
        return new AdminProfileResponse(
                profile.id(),
                profile.publicationStatus(),
                profile.firstName(),
                profile.lastName(),
                profile.displayName(),
                profile.location(),
                profile.country(),
                profile.availabilityStatus(),
                profile.professionalEmail(),
                profile.phone(),
                profile.showEmail(),
                profile.showPhone(),
                profile.showPhoto(),
                profile.showCv(),
                profile.showLinks(),
                profile.showStatistics(),
                mediaResponse(profile.photoMediaId(), "/api/v1/admin/profile/photo"),
                mediaResponse(profile.cvMediaId(), "/api/v1/admin/profile/cv"),
                translations.findByProfileIdOrderByLanguageCode(profile.id()).stream().map(this::toTranslationResponse).toList(),
                links.findByProfileIdOrderByDisplayOrderAscLabelAsc(profile.id()).stream().map(this::toLinkResponse).toList(),
                statistics.findByProfileIdOrderByDisplayOrderAscLabelFrAsc(profile.id()).stream().map(this::toStatisticResponse).toList()
        );
    }

    private AdminSiteSettingsResponse toAdminSettingsResponse(SiteSettings siteSettings) {
        ensureSectionSeeds();
        return new AdminSiteSettingsResponse(
                siteSettings.id(),
                siteSettings.publicSiteName(),
                siteSettings.monogram(),
                siteSettings.defaultLanguage(),
                parseLanguages(siteSettings.activeLanguages()),
                siteSettings.contactRecipientEmail(),
                siteSettings.footerCopyright(),
                siteSettings.showCvDownload(),
                siteSettings.showContactDetails(),
                siteSettings.showSocialLinks(),
                siteSettings.maintenanceMode(),
                mediaResponse(siteSettings.logoMediaId(), "/api/v1/admin/settings/logo"),
                mediaResponse(siteSettings.faviconMediaId(), "/api/v1/admin/settings/favicon"),
                sections.findAllByOrderByDisplayOrderAsc().stream().map(this::toSectionResponse).toList()
        );
    }

    private PublicPortfolioResponse.PublicSiteSettings publicSettings(SiteSettings siteSettings) {
        return new PublicPortfolioResponse.PublicSiteSettings(
                siteSettings.publicSiteName(),
                siteSettings.monogram(),
                siteSettings.defaultLanguage(),
                parseLanguages(siteSettings.activeLanguages()),
                siteSettings.footerCopyright(),
                siteSettings.maintenanceMode(),
                siteSettings.logoMediaId() == null ? null : "/api/v1/public/settings/logo",
                siteSettings.faviconMediaId() == null ? null : "/api/v1/public/settings/favicon"
        );
    }

    private PublicPortfolioResponse.PublicProfile toPublicProfile(
            ProfessionalProfile profile,
            ProfessionalProfileTranslation translation,
            SiteSettings siteSettings,
            String language
    ) {
        boolean contactDetailsVisible = siteSettings.showContactDetails();
        return new PublicPortfolioResponse.PublicProfile(
                profile.displayName(),
                profile.firstName(),
                profile.lastName(),
                profile.location(),
                profile.country(),
                profile.availabilityStatus(),
                translation.availabilityLabel(),
                translation.professionalTitle(),
                translation.tagline(),
                translation.shortSummary(),
                translation.biography(),
                translation.aboutText(),
                contactDetailsVisible && profile.showEmail() ? profile.professionalEmail() : null,
                contactDetailsVisible && profile.showPhone() ? profile.phone() : null,
                profile.showPhoto() && profile.photoMediaId() != null ? "/api/v1/public/profile/photo" : null,
                media.findById(profile.photoMediaId() == null ? new UUID(0L, 0L) : profile.photoMediaId())
                        .map(ProfileMedia::altText)
                        .orElse(null),
                profile.showCv() && siteSettings.showCvDownload() && profile.cvMediaId() != null ? "/api/v1/public/profile/cv" : null,
                translation.primaryCtaLabel(),
                translation.primaryCtaUrl(),
                translation.secondaryCtaLabel(),
                translation.secondaryCtaUrl(),
                translation.footerText(),
                publicLinks(profile, siteSettings),
                publicStatistics(profile, language)
        );
    }

    private List<PublicPortfolioResponse.PublicLink> publicLinks(ProfessionalProfile profile, SiteSettings siteSettings) {
        if (!profile.showLinks() || !siteSettings.showSocialLinks()) {
            return List.of();
        }
        return links.findByProfileIdOrderByDisplayOrderAscLabelAsc(profile.id())
                .stream()
                .filter(ProfessionalLink::visible)
                .map(link -> new PublicPortfolioResponse.PublicLink(
                        link.type().name(),
                        link.label(),
                        link.url(),
                        link.icon(),
                        link.openInNewTab()
                ))
                .toList();
    }

    private List<PublicPortfolioResponse.PublicStatistic> publicStatistics(ProfessionalProfile profile, String language) {
        if (!profile.showStatistics()) {
            return List.of();
        }
        return statistics.findByProfileIdOrderByDisplayOrderAscLabelFrAsc(profile.id())
                .stream()
                .filter(ProfessionalStatistic::visible)
                .map(statistic -> new PublicPortfolioResponse.PublicStatistic(
                        statistic.value(),
                        "en".equals(language) ? statistic.labelEn() : statistic.labelFr()
                ))
                .toList();
    }

    private ProfileTranslationResponse toTranslationResponse(ProfessionalProfileTranslation translation) {
        return new ProfileTranslationResponse(
                translation.languageCode(),
                translation.professionalTitle(),
                translation.tagline(),
                translation.shortSummary(),
                translation.biography(),
                translation.aboutText(),
                translation.availabilityLabel(),
                translation.primaryCtaLabel(),
                translation.primaryCtaUrl(),
                translation.secondaryCtaLabel(),
                translation.secondaryCtaUrl(),
                translation.footerText()
        );
    }

    private ProfessionalLinkResponse toLinkResponse(ProfessionalLink link) {
        return new ProfessionalLinkResponse(
                link.id(),
                link.type(),
                link.label(),
                link.url(),
                link.icon(),
                link.displayOrder(),
                link.visible(),
                link.openInNewTab()
        );
    }

    private ProfessionalStatisticResponse toStatisticResponse(ProfessionalStatistic statistic) {
        return new ProfessionalStatisticResponse(
                statistic.id(),
                statistic.value(),
                statistic.labelFr(),
                statistic.labelEn(),
                statistic.displayOrder(),
                statistic.visible()
        );
    }

    private SectionSettingResponse toSectionResponse(PortfolioSectionSetting section) {
        return new SectionSettingResponse(section.sectionKey(), section.label(), section.displayOrder(), section.visible());
    }

    private ProfileMediaResponse mediaResponse(UUID mediaId, String url) {
        if (mediaId == null) {
            return null;
        }
        return media.findById(mediaId)
                .map(media -> new ProfileMediaResponse(
                        media.id(),
                        media.originalFilename(),
                        media.contentType(),
                        media.sizeBytes(),
                        media.altText(),
                        url
                ))
                .orElse(null);
    }

    private ProfileMediaFile readMedia(UUID mediaId) {
        if (mediaId == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "MEDIA_NOT_FOUND", "The requested media was not found.");
        }
        return mediaStorage.read(media.findById(mediaId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MEDIA_NOT_FOUND", "The requested media was not found.")));
    }

    private void removeExistingMedia(UUID mediaId) {
        if (mediaId != null) {
            media.findById(mediaId).ifPresent(mediaStorage::delete);
        }
    }

    private void validateProfileRequest(AdminProfileRequest request) {
        if (request.publicationStatus() == PublicationStatus.PUBLISHED) {
            requireNotBlank(request.professionalEmail(), "Professional email is required before publication.");
        }
        Set<String> locales = new LinkedHashSet<>();
        for (ProfileTranslationRequest translation : safeList(request.translations())) {
            if (!locales.add(translation.languageCode())) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "DUPLICATE_TRANSLATION", "Each language can be provided only once.");
            }
            validateOptionalUrl(translation.primaryCtaUrl(), "Primary CTA URL is invalid.");
            validateOptionalUrl(translation.secondaryCtaUrl(), "Secondary CTA URL is invalid.");
        }
        for (ProfessionalLinkRequest link : safeList(request.links())) {
            validateRequiredUrl(link.url(), "Professional link URL is invalid.");
        }
    }

    private void validateSettingsRequest(AdminSiteSettingsRequest request) {
        List<String> languages = normalizedLanguages(request.activeLanguages());
        if (!languages.contains(request.defaultLanguage())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "DEFAULT_LANGUAGE_INACTIVE", "The default language must be active.");
        }
        Set<String> seenSections = new LinkedHashSet<>();
        for (SectionSettingRequest section : safeList(request.sections())) {
            if (!seenSections.add(section.sectionKey())) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "DUPLICATE_SECTION", "Each section can be configured only once.");
            }
        }
    }

    private void validateRequiredUrl(String url, String message) {
        requireNotBlank(url, message);
        validateOptionalUrl(url, message);
    }

    private void validateOptionalUrl(String url, String message) {
        if (url == null || url.trim().isBlank()) {
            return;
        }
        try {
            URI uri = new URI(url.trim());
            String scheme = uri.getScheme();
            if (scheme == null || !Set.of("https", "http", "mailto").contains(scheme.toLowerCase())) {
                throw new URISyntaxException(url, "Unsupported scheme");
            }
            if (!"mailto".equalsIgnoreCase(scheme) && uri.getHost() == null) {
                throw new URISyntaxException(url, "Missing host");
            }
        } catch (URISyntaxException exception) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "URL_INVALID", message);
        }
    }

    private void requireNotBlank(String value, String message) {
        if (value == null || value.trim().isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "REQUIRED_FIELD_MISSING", message);
        }
    }

    private boolean hasPublicTranslation(ProfessionalProfileTranslation translation) {
        return notBlank(translation.professionalTitle()) && notBlank(translation.shortSummary());
    }

    private boolean notBlank(String value) {
        return value != null && !value.trim().isBlank();
    }

    private List<String> normalizedLanguages(List<String> languages) {
        List<String> normalized = safeList(languages).stream()
                .map(String::trim)
                .distinct()
                .sorted(Comparator.naturalOrder())
                .toList();
        if (normalized.isEmpty() || !normalized.stream().allMatch(language -> Set.of("fr", "en").contains(language))) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "LANGUAGE_INVALID", "Active languages must contain fr and/or en.");
        }
        return normalized;
    }

    private List<String> parseLanguages(String activeLanguages) {
        if (activeLanguages == null || activeLanguages.isBlank()) {
            return List.of("fr");
        }
        return java.util.Arrays.stream(activeLanguages.split(","))
                .map(String::trim)
                .filter(language -> !language.isBlank())
                .toList();
    }

    private <T> List<T> safeList(List<T> values) {
        return values == null ? new ArrayList<>() : values;
    }

    private void record(Authentication authentication, String action, String resourceType, String resourceId, HttpServletRequest request) {
        AdminUser adminUser = authentication == null ? null : adminUsers.findByEmail(authentication.getName()).orElse(null);
        activityLog.record(adminUser, action, resourceType, resourceId, "SUCCESS", request);
    }

    private record SectionSeed(String key, String label, int order, boolean visible) {
    }
}
