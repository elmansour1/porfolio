package com.faouzi.portfolio.career.application.service;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.Clock;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import com.faouzi.portfolio.audit.application.service.ActivityLogService;
import com.faouzi.portfolio.auth.infrastructure.persistence.AdminUserRepository;
import com.faouzi.portfolio.career.api.dto.request.CareerCertificationRequest;
import com.faouzi.portfolio.career.api.dto.request.CareerCertificationTranslationRequest;
import com.faouzi.portfolio.career.api.dto.request.CareerEducationRequest;
import com.faouzi.portfolio.career.api.dto.request.CareerEducationTranslationRequest;
import com.faouzi.portfolio.career.api.dto.request.CareerExperienceRequest;
import com.faouzi.portfolio.career.api.dto.request.CareerExperienceTranslationRequest;
import com.faouzi.portfolio.career.api.dto.response.CareerCertificationResponse;
import com.faouzi.portfolio.career.api.dto.response.CareerEducationResponse;
import com.faouzi.portfolio.career.api.dto.response.CareerExperienceResponse;
import com.faouzi.portfolio.career.api.dto.response.CareerMetadataResponse;
import com.faouzi.portfolio.career.api.dto.response.PublicCareerResponse;
import com.faouzi.portfolio.career.application.mapper.CareerMapper;
import com.faouzi.portfolio.career.domain.model.CareerCertification;
import com.faouzi.portfolio.career.domain.model.CareerCertificationTranslation;
import com.faouzi.portfolio.career.domain.model.CareerEducation;
import com.faouzi.portfolio.career.domain.model.CareerEducationTranslation;
import com.faouzi.portfolio.career.domain.model.CareerExperience;
import com.faouzi.portfolio.career.domain.model.CareerExperienceSkill;
import com.faouzi.portfolio.career.domain.model.CareerExperienceTranslation;
import com.faouzi.portfolio.career.infrastructure.persistence.CareerCertificationRepository;
import com.faouzi.portfolio.career.infrastructure.persistence.CareerCertificationTranslationRepository;
import com.faouzi.portfolio.career.infrastructure.persistence.CareerEducationRepository;
import com.faouzi.portfolio.career.infrastructure.persistence.CareerEducationTranslationRepository;
import com.faouzi.portfolio.career.infrastructure.persistence.CareerExperienceRepository;
import com.faouzi.portfolio.career.infrastructure.persistence.CareerExperienceSkillRepository;
import com.faouzi.portfolio.career.infrastructure.persistence.CareerExperienceTranslationRepository;
import com.faouzi.portfolio.profile.domain.model.PublicationStatus;
import com.faouzi.portfolio.shared.error.ApiException;
import com.faouzi.portfolio.skills.infrastructure.persistence.SkillRepository;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CareerTimelineService {

    private static final List<String> SUPPORTED_LANGUAGES = List.of("fr", "en");

    private final CareerExperienceRepository experiences;
    private final CareerExperienceTranslationRepository experienceTranslations;
    private final CareerExperienceSkillRepository experienceSkills;
    private final CareerEducationRepository education;
    private final CareerEducationTranslationRepository educationTranslations;
    private final CareerCertificationRepository certifications;
    private final CareerCertificationTranslationRepository certificationTranslations;
    private final SkillRepository skills;
    private final AdminUserRepository adminUsers;
    private final ActivityLogService activityLog;
    private final CareerMapper mapper;
    private final Clock clock;

    @Transactional(readOnly = true)
    public List<CareerExperienceResponse> adminExperiences(PublicationStatus status) {
        return experiences.findAllByOrderByDisplayOrderAscStartDateDesc().stream()
                .filter(experience -> status == null || experience.getPublicationStatus() == status)
                .map(mapper::toExperienceResponse)
                .toList();
    }

    @Transactional
    public CareerExperienceResponse createExperience(CareerExperienceRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        validateExperienceRequest(request);
        CareerExperience experience = new CareerExperience(UUID.randomUUID(), request.displayOrder(), clock.instant());
        applyExperience(experience, request);
        experiences.save(experience);
        syncExperienceTranslations(experience.getId(), request.translations());
        syncExperienceSkills(experience.getId(), request.skillIds());
        record(authentication, "CAREER_EXPERIENCE_CREATED", "career_experience", experience.getId().toString(), httpRequest);
        return mapper.toExperienceResponse(experience);
    }

    @Transactional
    public CareerExperienceResponse updateExperience(UUID id, CareerExperienceRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        validateExperienceRequest(request);
        CareerExperience experience = requireExperience(id);
        applyExperience(experience, request);
        experiences.save(experience);
        syncExperienceTranslations(experience.getId(), request.translations());
        syncExperienceSkills(experience.getId(), request.skillIds());
        record(authentication, "CAREER_EXPERIENCE_UPDATED", "career_experience", experience.getId().toString(), httpRequest);
        return mapper.toExperienceResponse(experience);
    }

    @Transactional
    public void deleteExperience(UUID id, Authentication authentication, HttpServletRequest request) {
        if (!experiences.existsById(id)) {
            throw notFound("EXPERIENCE_NOT_FOUND", "Experience not found.");
        }
        experienceSkills.deleteByExperienceId(id);
        experienceTranslations.deleteByExperienceId(id);
        experiences.deleteById(id);
        record(authentication, "CAREER_EXPERIENCE_DELETED", "career_experience", id.toString(), request);
    }

    @Transactional(readOnly = true)
    public List<CareerEducationResponse> adminEducation(PublicationStatus status) {
        return education.findAllByOrderByDisplayOrderAscStartDateDesc().stream()
                .filter(item -> status == null || item.getPublicationStatus() == status)
                .map(mapper::toEducationResponse)
                .toList();
    }

    @Transactional
    public CareerEducationResponse createEducation(CareerEducationRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        validateEducationRequest(request);
        CareerEducation item = new CareerEducation(UUID.randomUUID(), request.displayOrder(), clock.instant());
        applyEducation(item, request);
        education.save(item);
        syncEducationTranslations(item.getId(), request.translations());
        record(authentication, "CAREER_EDUCATION_CREATED", "career_education", item.getId().toString(), httpRequest);
        return mapper.toEducationResponse(item);
    }

    @Transactional
    public CareerEducationResponse updateEducation(UUID id, CareerEducationRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        validateEducationRequest(request);
        CareerEducation item = requireEducation(id);
        applyEducation(item, request);
        education.save(item);
        syncEducationTranslations(item.getId(), request.translations());
        record(authentication, "CAREER_EDUCATION_UPDATED", "career_education", item.getId().toString(), httpRequest);
        return mapper.toEducationResponse(item);
    }

    @Transactional
    public void deleteEducation(UUID id, Authentication authentication, HttpServletRequest request) {
        if (!education.existsById(id)) {
            throw notFound("EDUCATION_NOT_FOUND", "Education item not found.");
        }
        educationTranslations.deleteByEducationId(id);
        education.deleteById(id);
        record(authentication, "CAREER_EDUCATION_DELETED", "career_education", id.toString(), request);
    }

    @Transactional(readOnly = true)
    public List<CareerCertificationResponse> adminCertifications(PublicationStatus status) {
        return certifications.findAllByOrderByDisplayOrderAscIssueDateDesc().stream()
                .filter(certification -> status == null || certification.getPublicationStatus() == status)
                .map(mapper::toCertificationResponse)
                .toList();
    }

    @Transactional
    public CareerCertificationResponse createCertification(CareerCertificationRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        validateCertificationRequest(request);
        CareerCertification certification = new CareerCertification(UUID.randomUUID(), request.displayOrder(), clock.instant());
        applyCertification(certification, request);
        certifications.save(certification);
        syncCertificationTranslations(certification.getId(), request.translations());
        record(authentication, "CAREER_CERTIFICATION_CREATED", "career_certification", certification.getId().toString(), httpRequest);
        return mapper.toCertificationResponse(certification);
    }

    @Transactional
    public CareerCertificationResponse updateCertification(UUID id, CareerCertificationRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        validateCertificationRequest(request);
        CareerCertification certification = requireCertification(id);
        applyCertification(certification, request);
        certifications.save(certification);
        syncCertificationTranslations(certification.getId(), request.translations());
        record(authentication, "CAREER_CERTIFICATION_UPDATED", "career_certification", certification.getId().toString(), httpRequest);
        return mapper.toCertificationResponse(certification);
    }

    @Transactional
    public void deleteCertification(UUID id, Authentication authentication, HttpServletRequest request) {
        if (!certifications.existsById(id)) {
            throw notFound("CERTIFICATION_NOT_FOUND", "Certification not found.");
        }
        certificationTranslations.deleteByCertificationId(id);
        certifications.deleteById(id);
        record(authentication, "CAREER_CERTIFICATION_DELETED", "career_certification", id.toString(), request);
    }

    @Transactional(readOnly = true)
    public CareerMetadataResponse metadata() {
        return mapper.metadata();
    }

    @Transactional(readOnly = true)
    public PublicCareerResponse publicCareer(String language) {
        String selectedLanguage = SUPPORTED_LANGUAGES.contains(language) ? language : "fr";
        return new PublicCareerResponse(
                selectedLanguage,
                experiences.findByPublicationStatusOrderByDisplayOrderAscStartDateDesc(PublicationStatus.PUBLISHED)
                        .stream()
                        .map(experience -> mapper.toPublicExperience(experience, selectedLanguage))
                        .flatMap(java.util.Optional::stream)
                        .toList(),
                education.findByPublicationStatusOrderByDisplayOrderAscStartDateDesc(PublicationStatus.PUBLISHED)
                        .stream()
                        .map(item -> mapper.toPublicEducation(item, selectedLanguage))
                        .flatMap(java.util.Optional::stream)
                        .toList(),
                certifications.findByPublicationStatusOrderByDisplayOrderAscIssueDateDesc(PublicationStatus.PUBLISHED)
                        .stream()
                        .map(certification -> mapper.toPublicCertification(certification, selectedLanguage))
                        .flatMap(java.util.Optional::stream)
                        .toList()
        );
    }

    private void applyExperience(CareerExperience experience, CareerExperienceRequest request) {
        experience.update(
                request.publicationStatus(),
                request.experienceType(),
                request.contractType(),
                request.organization(),
                request.roleTitle(),
                request.location(),
                request.workMode(),
                request.startDate(),
                request.endDate(),
                request.currentPosition(),
                request.confidential(),
                request.organizationUrl(),
                request.logoMediaId(),
                request.displayOrder(),
                clock.instant()
        );
    }

    private void applyEducation(CareerEducation item, CareerEducationRequest request) {
        item.update(
                request.publicationStatus(),
                request.institution(),
                request.educationLevel(),
                request.location(),
                request.startDate(),
                request.endDate(),
                request.currentEducation(),
                request.url(),
                request.logoMediaId(),
                request.displayOrder(),
                clock.instant()
        );
    }

    private void applyCertification(CareerCertification certification, CareerCertificationRequest request) {
        certification.update(
                request.publicationStatus(),
                request.issuer(),
                request.issueDate(),
                request.expiryDate(),
                request.noExpiry(),
                request.credentialId(),
                request.verificationUrl(),
                request.documentMediaId(),
                request.displayOrder(),
                clock.instant()
        );
    }

    private void syncExperienceTranslations(UUID experienceId, List<CareerExperienceTranslationRequest> requests) {
        Map<String, CareerExperienceTranslation> existing = new LinkedHashMap<>();
        for (CareerExperienceTranslation translation : experienceTranslations.findByExperienceIdOrderByLanguageCode(experienceId)) {
            existing.put(translation.getLanguageCode(), translation);
        }
        for (CareerExperienceTranslationRequest request : safeList(requests)) {
            CareerExperienceTranslation translation = existing.remove(request.languageCode());
            if (translation == null) {
                translation = new CareerExperienceTranslation(UUID.randomUUID(), experienceId, request.languageCode());
            }
            translation.update(request.summary(), request.missions(), request.achievements(), request.confidentialLabel());
            experienceTranslations.save(translation);
        }
        experienceTranslations.deleteAll(existing.values());
    }

    private void syncEducationTranslations(UUID educationId, List<CareerEducationTranslationRequest> requests) {
        Map<String, CareerEducationTranslation> existing = new LinkedHashMap<>();
        for (CareerEducationTranslation translation : educationTranslations.findByEducationIdOrderByLanguageCode(educationId)) {
            existing.put(translation.getLanguageCode(), translation);
        }
        for (CareerEducationTranslationRequest request : safeList(requests)) {
            CareerEducationTranslation translation = existing.remove(request.languageCode());
            if (translation == null) {
                translation = new CareerEducationTranslation(UUID.randomUUID(), educationId, request.languageCode());
            }
            translation.update(request.title(), request.field(), request.description());
            educationTranslations.save(translation);
        }
        educationTranslations.deleteAll(existing.values());
    }

    private void syncCertificationTranslations(UUID certificationId, List<CareerCertificationTranslationRequest> requests) {
        Map<String, CareerCertificationTranslation> existing = new LinkedHashMap<>();
        for (CareerCertificationTranslation translation : certificationTranslations.findByCertificationIdOrderByLanguageCode(certificationId)) {
            existing.put(translation.getLanguageCode(), translation);
        }
        for (CareerCertificationTranslationRequest request : safeList(requests)) {
            CareerCertificationTranslation translation = existing.remove(request.languageCode());
            if (translation == null) {
                translation = new CareerCertificationTranslation(UUID.randomUUID(), certificationId, request.languageCode());
            }
            translation.update(request.name(), request.description());
            certificationTranslations.save(translation);
        }
        certificationTranslations.deleteAll(existing.values());
    }

    private void syncExperienceSkills(UUID experienceId, List<UUID> skillIds) {
        experienceSkills.deleteByExperienceId(experienceId);
        int order = 0;
        for (UUID skillId : new LinkedHashSet<>(safeList(skillIds))) {
            if (!skills.existsById(skillId)) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "SKILL_NOT_FOUND", "A selected skill does not exist.");
            }
            experienceSkills.save(new CareerExperienceSkill(experienceId, skillId, order));
            order += 10;
        }
    }

    private void validateExperienceRequest(CareerExperienceRequest request) {
        ensureDistinctLanguages(request.translations());
        validateOptionalUrl(request.organizationUrl(), "Organization URL is invalid.");
    }

    private void validateEducationRequest(CareerEducationRequest request) {
        ensureDistinctLanguages(request.translations());
        validateOptionalUrl(request.url(), "Education URL is invalid.");
    }

    private void validateCertificationRequest(CareerCertificationRequest request) {
        ensureDistinctLanguages(request.translations());
        validateOptionalUrl(request.verificationUrl(), "Certification verification URL is invalid.");
    }

    private void ensureDistinctLanguages(List<? extends Object> requests) {
        Set<String> languages = new LinkedHashSet<>();
        for (Object request : safeList(requests)) {
            String languageCode = languageCode(request);
            if (languageCode != null && !languages.add(languageCode)) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "DUPLICATE_TRANSLATION", "Each language can be provided only once.");
            }
        }
    }

    private String languageCode(Object request) {
        if (request instanceof CareerExperienceTranslationRequest translation) {
            return translation.languageCode();
        }
        if (request instanceof CareerEducationTranslationRequest translation) {
            return translation.languageCode();
        }
        if (request instanceof CareerCertificationTranslationRequest translation) {
            return translation.languageCode();
        }
        return null;
    }

    private void validateOptionalUrl(String url, String message) {
        if (url == null || url.trim().isBlank()) {
            return;
        }
        try {
            URI uri = new URI(url.trim());
            String scheme = uri.getScheme();
            if (scheme == null || !Set.of("https", "http").contains(scheme.toLowerCase()) || uri.getHost() == null) {
                throw new URISyntaxException(url, "Unsupported URL");
            }
        } catch (URISyntaxException exception) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "URL_INVALID", message);
        }
    }

    private CareerExperience requireExperience(UUID id) {
        return experiences.findById(id).orElseThrow(() -> notFound("EXPERIENCE_NOT_FOUND", "Experience not found."));
    }

    private CareerEducation requireEducation(UUID id) {
        return education.findById(id).orElseThrow(() -> notFound("EDUCATION_NOT_FOUND", "Education item not found."));
    }

    private CareerCertification requireCertification(UUID id) {
        return certifications.findById(id).orElseThrow(() -> notFound("CERTIFICATION_NOT_FOUND", "Certification not found."));
    }

    private <T> List<T> safeList(List<T> values) {
        return values == null ? new ArrayList<>() : values;
    }

    private ApiException notFound(String code, String message) {
        return new ApiException(HttpStatus.NOT_FOUND, code, message);
    }

    private void record(Authentication authentication, String action, String resourceType, String resourceId, HttpServletRequest request) {
        if (authentication == null) {
            return;
        }
        adminUsers.findByEmail(authentication.getName())
                .ifPresent(admin -> activityLog.record(admin, action, resourceType, resourceId, "SUCCESS", request));
    }
}
