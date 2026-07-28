package com.faouzi.portfolio.profile.application.service;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.Clock;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import com.faouzi.portfolio.audit.application.service.ActivityLogService;
import com.faouzi.portfolio.auth.domain.model.AdminUser;
import com.faouzi.portfolio.auth.infrastructure.persistence.AdminUserRepository;
import com.faouzi.portfolio.profile.application.mapper.PortfolioProfileMapper;
import com.faouzi.portfolio.profile.application.dto.ProfileMediaFile;
import com.faouzi.portfolio.profile.api.dto.request.AdminProfileRequest;
import com.faouzi.portfolio.profile.api.dto.response.AdminProfileResponse;
import com.faouzi.portfolio.profile.api.dto.request.AdminSiteSettingsRequest;
import com.faouzi.portfolio.profile.api.dto.response.AdminSiteSettingsResponse;
import com.faouzi.portfolio.profile.api.dto.request.ProfessionalLinkRequest;
import com.faouzi.portfolio.profile.api.dto.request.ProfessionalStatisticRequest;
import com.faouzi.portfolio.profile.api.dto.request.ProfileTranslationRequest;
import com.faouzi.portfolio.profile.api.dto.response.PublicPortfolioResponse;
import com.faouzi.portfolio.profile.api.dto.request.SectionSettingRequest;
import com.faouzi.portfolio.profile.api.dto.response.SectionSettingResponse;
import com.faouzi.portfolio.profile.domain.model.PortfolioSectionSetting;
import com.faouzi.portfolio.profile.infrastructure.persistence.PortfolioSectionSettingRepository;
import com.faouzi.portfolio.profile.domain.model.ProfessionalLink;
import com.faouzi.portfolio.profile.infrastructure.persistence.ProfessionalLinkRepository;
import com.faouzi.portfolio.profile.domain.model.ProfessionalProfile;
import com.faouzi.portfolio.profile.infrastructure.persistence.ProfessionalProfileRepository;
import com.faouzi.portfolio.profile.domain.model.ProfessionalProfileTranslation;
import com.faouzi.portfolio.profile.infrastructure.persistence.ProfessionalProfileTranslationRepository;
import com.faouzi.portfolio.profile.domain.model.ProfessionalStatistic;
import com.faouzi.portfolio.profile.infrastructure.persistence.ProfessionalStatisticRepository;
import com.faouzi.portfolio.profile.domain.model.ProfileMedia;
import com.faouzi.portfolio.profile.domain.model.ProfileMediaKind;
import com.faouzi.portfolio.profile.infrastructure.persistence.ProfileMediaRepository;
import com.faouzi.portfolio.profile.domain.model.ProfileTranslationValues;
import com.faouzi.portfolio.profile.domain.model.PublicationStatus;
import com.faouzi.portfolio.profile.domain.model.SiteSettings;
import com.faouzi.portfolio.profile.infrastructure.persistence.SiteSettingsRepository;
import com.faouzi.portfolio.profile.infrastructure.storage.ProfileMediaStorageService;
import com.faouzi.portfolio.shared.error.ApiException;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
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
    private final PortfolioProfileMapper mapper;
    private final Clock clock;

    @Transactional
    public AdminProfileResponse adminProfile() {
        return mapper.toAdminProfileResponse(ensureProfile());
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
        replaceTranslations(profile.getId(), request.translations());
        replaceLinks(profile.getId(), request.links());
        replaceStatistics(profile.getId(), request.statistics());
        record(authentication, "PROFILE_UPDATED", "professional_profile", profile.getId().toString(), httpRequest);
        return mapper.toAdminProfileResponse(profile);
    }

    @Transactional
    public AdminProfileResponse uploadProfilePhoto(MultipartFile file, String altText, Authentication authentication, HttpServletRequest request) {
        ProfessionalProfile profile = ensureProfile();
        removeExistingMedia(profile.getPhotoMediaId());
        ProfileMedia stored = mediaStorage.store(file, ProfileMediaKind.PROFILE_PHOTO, altText);
        profile.attachPhoto(stored.getId(), clock.instant());
        profiles.save(profile);
        record(authentication, "PROFILE_PHOTO_REPLACED", "profile_media", stored.getId().toString(), request);
        return mapper.toAdminProfileResponse(profile);
    }

    @Transactional
    public AdminProfileResponse deleteProfilePhoto(Authentication authentication, HttpServletRequest request) {
        ProfessionalProfile profile = ensureProfile();
        removeExistingMedia(profile.getPhotoMediaId());
        profile.removePhoto(clock.instant());
        profiles.save(profile);
        record(authentication, "PROFILE_PHOTO_REMOVED", "professional_profile", profile.getId().toString(), request);
        return mapper.toAdminProfileResponse(profile);
    }

    @Transactional
    public AdminProfileResponse uploadCv(MultipartFile file, Authentication authentication, HttpServletRequest request) {
        ProfessionalProfile profile = ensureProfile();
        removeExistingMedia(profile.getCvMediaId());
        ProfileMedia stored = mediaStorage.store(file, ProfileMediaKind.CV_PDF, null);
        profile.attachCv(stored.getId(), clock.instant());
        profiles.save(profile);
        record(authentication, "PROFILE_CV_REPLACED", "profile_media", stored.getId().toString(), request);
        return mapper.toAdminProfileResponse(profile);
    }

    @Transactional
    public AdminProfileResponse deleteCv(Authentication authentication, HttpServletRequest request) {
        ProfessionalProfile profile = ensureProfile();
        removeExistingMedia(profile.getCvMediaId());
        profile.removeCv(clock.instant());
        profiles.save(profile);
        record(authentication, "PROFILE_CV_REMOVED", "professional_profile", profile.getId().toString(), request);
        return mapper.toAdminProfileResponse(profile);
    }

    @Transactional
    public AdminSiteSettingsResponse adminSettings() {
        SiteSettings siteSettings = ensureSettings();
        return mapper.toAdminSettingsResponse(siteSettings, parseLanguages(siteSettings.getActiveLanguages()));
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
        record(authentication, "SITE_SETTINGS_UPDATED", "site_settings", siteSettings.getId().toString(), httpRequest);
        return mapper.toAdminSettingsResponse(siteSettings, parseLanguages(siteSettings.getActiveLanguages()));
    }

    @Transactional
    public AdminSiteSettingsResponse uploadLogo(MultipartFile file, String altText, Authentication authentication, HttpServletRequest request) {
        SiteSettings siteSettings = ensureSettings();
        removeExistingMedia(siteSettings.getLogoMediaId());
        ProfileMedia stored = mediaStorage.store(file, ProfileMediaKind.SITE_LOGO, altText);
        siteSettings.attachLogo(stored.getId(), clock.instant());
        settings.save(siteSettings);
        record(authentication, "SITE_LOGO_REPLACED", "profile_media", stored.getId().toString(), request);
        return mapper.toAdminSettingsResponse(siteSettings, parseLanguages(siteSettings.getActiveLanguages()));
    }

    @Transactional
    public AdminSiteSettingsResponse deleteLogo(Authentication authentication, HttpServletRequest request) {
        SiteSettings siteSettings = ensureSettings();
        removeExistingMedia(siteSettings.getLogoMediaId());
        siteSettings.removeLogo(clock.instant());
        settings.save(siteSettings);
        record(authentication, "SITE_LOGO_REMOVED", "site_settings", siteSettings.getId().toString(), request);
        return mapper.toAdminSettingsResponse(siteSettings, parseLanguages(siteSettings.getActiveLanguages()));
    }

    @Transactional
    public AdminSiteSettingsResponse uploadFavicon(MultipartFile file, Authentication authentication, HttpServletRequest request) {
        SiteSettings siteSettings = ensureSettings();
        removeExistingMedia(siteSettings.getFaviconMediaId());
        ProfileMedia stored = mediaStorage.store(file, ProfileMediaKind.SITE_FAVICON, "Favicon");
        siteSettings.attachFavicon(stored.getId(), clock.instant());
        settings.save(siteSettings);
        record(authentication, "SITE_FAVICON_REPLACED", "profile_media", stored.getId().toString(), request);
        return mapper.toAdminSettingsResponse(siteSettings, parseLanguages(siteSettings.getActiveLanguages()));
    }

    @Transactional
    public AdminSiteSettingsResponse deleteFavicon(Authentication authentication, HttpServletRequest request) {
        SiteSettings siteSettings = ensureSettings();
        removeExistingMedia(siteSettings.getFaviconMediaId());
        siteSettings.removeFavicon(clock.instant());
        settings.save(siteSettings);
        record(authentication, "SITE_FAVICON_REMOVED", "site_settings", siteSettings.getId().toString(), request);
        return mapper.toAdminSettingsResponse(siteSettings, parseLanguages(siteSettings.getActiveLanguages()));
    }

    @Transactional(readOnly = true)
    public PublicPortfolioResponse publicPortfolio(String language) {
        SiteSettings siteSettings = settings.findAll().stream().findFirst()
                .orElse(new SiteSettings(UUID.randomUUID(), clock.instant()));
        List<String> activeLanguages = parseLanguages(siteSettings.getActiveLanguages());
        String selectedLanguage = activeLanguages.contains(language) ? language : siteSettings.getDefaultLanguage();
        List<SectionSettingResponse> sectionResponses = sections.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(mapper::toSectionResponse)
                .toList();

        Optional<ProfessionalProfile> profile = profiles.findAll().stream().findFirst();
        if (profile.isEmpty() || profile.get().getPublicationStatus() != PublicationStatus.PUBLISHED) {
            return new PublicPortfolioResponse(false, selectedLanguage, mapper.publicSettings(siteSettings, parseLanguages(siteSettings.getActiveLanguages())), null, sectionResponses);
        }

        Optional<ProfessionalProfileTranslation> translation =
                translations.findByProfileIdAndLanguageCode(profile.get().getId(), selectedLanguage);
        if (translation.isEmpty() || !hasPublicTranslation(translation.get())) {
            return new PublicPortfolioResponse(false, selectedLanguage, mapper.publicSettings(siteSettings, parseLanguages(siteSettings.getActiveLanguages())), null, sectionResponses);
        }

        return new PublicPortfolioResponse(
                true,
                selectedLanguage,
                mapper.publicSettings(siteSettings, parseLanguages(siteSettings.getActiveLanguages())),
                mapper.toPublicProfile(profile.get(), translation.get(), siteSettings, selectedLanguage),
                sectionResponses
        );
    }

    @Transactional(readOnly = true)
    public ProfileMediaFile readAdminProfilePhoto() {
        return readMedia(ensureProfileReadOnly().getPhotoMediaId());
    }

    @Transactional(readOnly = true)
    public ProfileMediaFile readAdminCv() {
        return readMedia(ensureProfileReadOnly().getCvMediaId());
    }

    @Transactional(readOnly = true)
    public ProfileMediaFile readAdminLogo() {
        return readMedia(ensureSettingsReadOnly().getLogoMediaId());
    }

    @Transactional(readOnly = true)
    public ProfileMediaFile readAdminFavicon() {
        return readMedia(ensureSettingsReadOnly().getFaviconMediaId());
    }

    @Transactional(readOnly = true)
    public ProfileMediaFile readPublicProfilePhoto() {
        ProfessionalProfile profile = ensurePublishedProfile();
        if (!profile.isShowPhoto()) {
            throw new ApiException(HttpStatus.NOT_FOUND, "MEDIA_NOT_PUBLIC", "The requested media is not public.");
        }
        return readMedia(profile.getPhotoMediaId());
    }

    @Transactional(readOnly = true)
    public ProfileMediaFile readPublicCv() {
        ProfessionalProfile profile = ensurePublishedProfile();
        SiteSettings siteSettings = ensureSettingsReadOnly();
        if (!profile.isShowCv() || !siteSettings.isShowCvDownload()) {
            throw new ApiException(HttpStatus.NOT_FOUND, "MEDIA_NOT_PUBLIC", "The requested media is not public.");
        }
        return readMedia(profile.getCvMediaId());
    }

    @Transactional(readOnly = true)
    public ProfileMediaFile readPublicLogo() {
        return readMedia(ensureSettingsReadOnly().getLogoMediaId());
    }

    @Transactional(readOnly = true)
    public ProfileMediaFile readPublicFavicon() {
        return readMedia(ensureSettingsReadOnly().getFaviconMediaId());
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
        if (profile.getPublicationStatus() != PublicationStatus.PUBLISHED) {
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
                .map(PortfolioSectionSetting::getSectionKey)
                .collect(java.util.stream.Collectors.toSet());
        for (SectionSeed seed : SECTION_SEEDS) {
            if (!existing.contains(seed.key())) {
                sections.save(new PortfolioSectionSetting(seed.key(), seed.label(), seed.order(), seed.visible(), clock.instant()));
            }
        }
    }

    private void replaceTranslations(UUID profileId, List<ProfileTranslationRequest> requests) {
        Map<String, ProfessionalProfileTranslation> existingByLanguage = new LinkedHashMap<>();
        for (ProfessionalProfileTranslation translation : translations.findByProfileIdOrderByLanguageCode(profileId)) {
            existingByLanguage.put(translation.getLanguageCode(), translation);
        }

        for (ProfileTranslationRequest request : safeList(requests)) {
            ProfessionalProfileTranslation translation = existingByLanguage.remove(request.languageCode());
            if (translation == null) {
                translation = new ProfessionalProfileTranslation(UUID.randomUUID(), profileId, request.languageCode());
            }
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
        translations.deleteAll(existingByLanguage.values());
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
        return notBlank(translation.getProfessionalTitle()) && notBlank(translation.getShortSummary());
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
