package com.faouzi.portfolio.service.application.service;

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
import com.faouzi.portfolio.profile.domain.model.PublicationStatus;
import com.faouzi.portfolio.service.api.dto.request.BenefitRequest;
import com.faouzi.portfolio.service.api.dto.request.CreateServiceRequest;
import com.faouzi.portfolio.service.api.dto.request.CreateWorkProcessStepRequest;
import com.faouzi.portfolio.service.api.dto.request.DeliverableRequest;
import com.faouzi.portfolio.service.api.dto.request.ServiceItemTranslationRequest;
import com.faouzi.portfolio.service.api.dto.request.ServiceTranslationRequest;
import com.faouzi.portfolio.service.api.dto.request.UpdateServiceRequest;
import com.faouzi.portfolio.service.api.dto.request.UpdateWorkProcessStepRequest;
import com.faouzi.portfolio.service.api.dto.request.WorkProcessStepTranslationRequest;
import com.faouzi.portfolio.service.api.dto.response.ServiceAdminDetailResponse;
import com.faouzi.portfolio.service.api.dto.response.ServiceAdminSummaryResponse;
import com.faouzi.portfolio.service.api.dto.response.ServiceMetadataResponse;
import com.faouzi.portfolio.service.api.dto.response.ServicePublicResponse;
import com.faouzi.portfolio.service.api.dto.response.WorkProcessStepAdminResponse;
import com.faouzi.portfolio.service.api.dto.response.WorkProcessStepPublicResponse;
import com.faouzi.portfolio.service.application.mapper.ProfessionalServiceMapper;
import com.faouzi.portfolio.service.domain.model.ProfessionalService;
import com.faouzi.portfolio.service.domain.model.ProfessionalServiceTranslation;
import com.faouzi.portfolio.service.domain.model.ServiceBenefit;
import com.faouzi.portfolio.service.domain.model.ServiceBenefitTranslation;
import com.faouzi.portfolio.service.domain.model.ServiceCtaType;
import com.faouzi.portfolio.service.domain.model.ServiceDeliverable;
import com.faouzi.portfolio.service.domain.model.ServiceDeliverableTranslation;
import com.faouzi.portfolio.service.domain.model.ServiceSkill;
import com.faouzi.portfolio.service.domain.model.ServiceSkillRelationType;
import com.faouzi.portfolio.service.domain.model.WorkProcessStep;
import com.faouzi.portfolio.service.domain.model.WorkProcessStepTranslation;
import com.faouzi.portfolio.service.infrastructure.persistence.ProfessionalServiceRepository;
import com.faouzi.portfolio.service.infrastructure.persistence.ProfessionalServiceTranslationRepository;
import com.faouzi.portfolio.service.infrastructure.persistence.ServiceBenefitRepository;
import com.faouzi.portfolio.service.infrastructure.persistence.ServiceBenefitTranslationRepository;
import com.faouzi.portfolio.service.infrastructure.persistence.ServiceDeliverableRepository;
import com.faouzi.portfolio.service.infrastructure.persistence.ServiceDeliverableTranslationRepository;
import com.faouzi.portfolio.service.infrastructure.persistence.ServiceSkillRepository;
import com.faouzi.portfolio.service.infrastructure.persistence.WorkProcessStepRepository;
import com.faouzi.portfolio.service.infrastructure.persistence.WorkProcessStepTranslationRepository;
import com.faouzi.portfolio.shared.api.dto.response.PageResponse;
import com.faouzi.portfolio.shared.error.ApiException;
import com.faouzi.portfolio.skills.infrastructure.persistence.SkillRepository;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfessionalServiceApplicationService {

    private static final List<String> SUPPORTED_LANGUAGES = List.of("fr", "en");
    private static final int DEFAULT_PAGE_SIZE = 12;
    private static final int MAX_PUBLIC_FEATURED = 4;

    private final ProfessionalServiceRepository services;
    private final ProfessionalServiceTranslationRepository translations;
    private final ServiceBenefitRepository benefits;
    private final ServiceBenefitTranslationRepository benefitTranslations;
    private final ServiceDeliverableRepository deliverables;
    private final ServiceDeliverableTranslationRepository deliverableTranslations;
    private final ServiceSkillRepository serviceSkills;
    private final WorkProcessStepRepository steps;
    private final WorkProcessStepTranslationRepository stepTranslations;
    private final SkillRepository skills;
    private final AdminUserRepository adminUsers;
    private final ActivityLogService activityLog;
    private final ProfessionalServiceMapper mapper;
    private final Clock clock;

    @Transactional(readOnly = true)
    public PageResponse<ServiceAdminSummaryResponse> adminList(PublicationStatus status, Boolean featured, Integer page, Integer size) {
        Pageable pageable = pageable(page, size);
        Page<ProfessionalService> result;
        if (status != null && featured != null) {
            result = services.findByPublicationStatusAndFeaturedOrderByDisplayOrderAsc(status, featured, pageable);
        } else if (status != null) {
            result = services.findByPublicationStatusOrderByDisplayOrderAsc(status, pageable);
        } else if (featured != null) {
            result = services.findByFeaturedOrderByDisplayOrderAsc(featured, pageable);
        } else {
            result = services.findAll(pageable);
        }
        return PageResponse.of(result.map(mapper::toAdminSummary));
    }

    @Transactional(readOnly = true)
    public ServiceAdminDetailResponse adminDetail(UUID id) {
        return mapper.toAdminDetail(requireService(id));
    }

    @Transactional(readOnly = true)
    public ServiceMetadataResponse metadata() {
        return mapper.metadata();
    }

    @Transactional
    public ServiceAdminDetailResponse create(CreateServiceRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        validateServiceRequest(request.slug(), request.ctaType(), request.ctaTarget(), request.visualUrl(), request.translations(), request.benefits(),
                request.deliverables(), request.technologyIds(), request.skillIds(), null);
        ProfessionalService service = new ProfessionalService(UUID.randomUUID(), request.displayOrder(), clock.instant());
        apply(service, request);
        services.save(service);
        syncServiceChildren(service.getId(), request.translations(), request.benefits(), request.deliverables(),
                request.technologyIds(), request.skillIds());
        record(authentication, "SERVICE_CREATED", "professional_service", service.getId().toString(), httpRequest);
        return mapper.toAdminDetail(service);
    }

    @Transactional
    public ServiceAdminDetailResponse update(UUID id, UpdateServiceRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        ProfessionalService service = requireService(id);
        validateServiceRequest(request.slug(), request.ctaType(), request.ctaTarget(), request.visualUrl(), request.translations(), request.benefits(),
                request.deliverables(), request.technologyIds(), request.skillIds(), id);
        apply(service, request);
        services.save(service);
        syncServiceChildren(service.getId(), request.translations(), request.benefits(), request.deliverables(),
                request.technologyIds(), request.skillIds());
        record(authentication, "SERVICE_UPDATED", "professional_service", id.toString(), httpRequest);
        return mapper.toAdminDetail(service);
    }

    @Transactional
    public ServiceAdminDetailResponse publish(UUID id, Authentication authentication, HttpServletRequest httpRequest) {
        ProfessionalService service = requireService(id);
        ensureServicePublishable(service.getId());
        service.publish(clock.instant());
        record(authentication, "SERVICE_PUBLISHED", "professional_service", id.toString(), httpRequest);
        return mapper.toAdminDetail(service);
    }

    @Transactional
    public ServiceAdminDetailResponse unpublish(UUID id, Authentication authentication, HttpServletRequest httpRequest) {
        ProfessionalService service = requireService(id);
        service.unpublish(clock.instant());
        record(authentication, "SERVICE_UNPUBLISHED", "professional_service", id.toString(), httpRequest);
        return mapper.toAdminDetail(service);
    }

    @Transactional
    public ServiceAdminDetailResponse archive(UUID id, Authentication authentication, HttpServletRequest httpRequest) {
        ProfessionalService service = requireService(id);
        service.archive(clock.instant());
        record(authentication, "SERVICE_ARCHIVED", "professional_service", id.toString(), httpRequest);
        return mapper.toAdminDetail(service);
    }

    @Transactional
    public ServiceAdminDetailResponse setFeatured(UUID id, boolean featured, Authentication authentication, HttpServletRequest httpRequest) {
        ProfessionalService service = requireService(id);
        service.setFeatured(featured, clock.instant());
        record(authentication, featured ? "SERVICE_FEATURED" : "SERVICE_UNFEATURED", "professional_service", id.toString(), httpRequest);
        return mapper.toAdminDetail(service);
    }

    @Transactional
    public List<ServiceAdminSummaryResponse> reorderServices(List<UUID> orderedIds, Authentication authentication, HttpServletRequest httpRequest) {
        int order = 0;
        for (UUID id : safeList(orderedIds)) {
            ProfessionalService service = services.findById(id).orElse(null);
            if (service != null) {
                service.reorder(order, clock.instant());
            }
            order += 10;
        }
        record(authentication, "SERVICES_REORDERED", "professional_service", "bulk", httpRequest);
        return services.findAll(Sort.by(Sort.Direction.ASC, "displayOrder")).stream()
                .map(mapper::toAdminSummary)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ServicePublicResponse> publicServices(String language) {
        String selectedLanguage = selectLanguage(language);
        return services.findByPublicationStatusOrderByDisplayOrderAsc(PublicationStatus.PUBLISHED).stream()
                .map(service -> mapper.toPublic(service, selectedLanguage))
                .flatMap(java.util.Optional::stream)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ServicePublicResponse> publicFeatured(String language) {
        String selectedLanguage = selectLanguage(language);
        return services.findByPublicationStatusAndFeaturedTrueOrderByDisplayOrderAsc(PublicationStatus.PUBLISHED).stream()
                .limit(MAX_PUBLIC_FEATURED)
                .map(service -> mapper.toPublic(service, selectedLanguage))
                .flatMap(java.util.Optional::stream)
                .toList();
    }

    @Transactional(readOnly = true)
    public ServicePublicResponse publicDetail(String slug, String language) {
        String selectedLanguage = selectLanguage(language);
        return services.findBySlugAndPublicationStatus(slug, PublicationStatus.PUBLISHED)
                .flatMap(service -> mapper.toPublic(service, selectedLanguage))
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "SERVICE_NOT_FOUND", "Service not found."));
    }

    @Transactional(readOnly = true)
    public List<WorkProcessStepAdminResponse> adminSteps() {
        return steps.findAllByOrderByDisplayOrderAsc().stream().map(mapper::toAdminStep).toList();
    }

    @Transactional
    public WorkProcessStepAdminResponse createStep(CreateWorkProcessStepRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        validateStepRequest(request.translations());
        WorkProcessStep step = new WorkProcessStep(UUID.randomUUID(), request.displayOrder(), clock.instant());
        step.update(request.displayOrder(), request.icon(), clock.instant());
        steps.save(step);
        syncStepTranslations(step.getId(), request.translations());
        record(authentication, "WORK_PROCESS_STEP_CREATED", "work_process_step", step.getId().toString(), httpRequest);
        return mapper.toAdminStep(step);
    }

    @Transactional
    public WorkProcessStepAdminResponse updateStep(UUID id, UpdateWorkProcessStepRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        validateStepRequest(request.translations());
        WorkProcessStep step = requireStep(id);
        step.update(request.displayOrder(), request.icon(), clock.instant());
        syncStepTranslations(step.getId(), request.translations());
        record(authentication, "WORK_PROCESS_STEP_UPDATED", "work_process_step", id.toString(), httpRequest);
        return mapper.toAdminStep(step);
    }

    @Transactional
    public WorkProcessStepAdminResponse publishStep(UUID id, Authentication authentication, HttpServletRequest httpRequest) {
        WorkProcessStep step = requireStep(id);
        ensureStepPublishable(id);
        step.publish(clock.instant());
        record(authentication, "WORK_PROCESS_STEP_PUBLISHED", "work_process_step", id.toString(), httpRequest);
        return mapper.toAdminStep(step);
    }

    @Transactional
    public WorkProcessStepAdminResponse unpublishStep(UUID id, Authentication authentication, HttpServletRequest httpRequest) {
        WorkProcessStep step = requireStep(id);
        step.unpublish(clock.instant());
        record(authentication, "WORK_PROCESS_STEP_UNPUBLISHED", "work_process_step", id.toString(), httpRequest);
        return mapper.toAdminStep(step);
    }

    @Transactional
    public WorkProcessStepAdminResponse archiveStep(UUID id, Authentication authentication, HttpServletRequest httpRequest) {
        WorkProcessStep step = requireStep(id);
        step.archive(clock.instant());
        record(authentication, "WORK_PROCESS_STEP_ARCHIVED", "work_process_step", id.toString(), httpRequest);
        return mapper.toAdminStep(step);
    }

    @Transactional
    public List<WorkProcessStepAdminResponse> reorderSteps(List<UUID> orderedIds, Authentication authentication, HttpServletRequest httpRequest) {
        int order = 0;
        for (UUID id : safeList(orderedIds)) {
            WorkProcessStep step = steps.findById(id).orElse(null);
            if (step != null) {
                step.reorder(order, clock.instant());
            }
            order += 10;
        }
        record(authentication, "WORK_PROCESS_STEPS_REORDERED", "work_process_step", "bulk", httpRequest);
        return adminSteps();
    }

    @Transactional(readOnly = true)
    public List<WorkProcessStepPublicResponse> publicSteps(String language) {
        String selectedLanguage = selectLanguage(language);
        return steps.findByPublicationStatusOrderByDisplayOrderAsc(PublicationStatus.PUBLISHED).stream()
                .map(step -> mapper.toPublicStep(step, selectedLanguage))
                .flatMap(java.util.Optional::stream)
                .toList();
    }

    private void apply(ProfessionalService service, CreateServiceRequest request) {
        service.update(request.slug(), request.featured(), request.displayOrder(), request.icon(), request.visualUrl(),
                request.ctaType(), request.ctaTarget(), clock.instant());
    }

    private void apply(ProfessionalService service, UpdateServiceRequest request) {
        service.update(request.slug(), request.featured(), request.displayOrder(), request.icon(), request.visualUrl(),
                request.ctaType(), request.ctaTarget(), clock.instant());
    }

    private void syncServiceChildren(UUID serviceId, List<ServiceTranslationRequest> translationRequests,
                                     List<BenefitRequest> benefitRequests, List<DeliverableRequest> deliverableRequests,
                                     List<UUID> technologyIds, List<UUID> skillIds) {
        syncTranslations(serviceId, translationRequests);
        syncBenefits(serviceId, benefitRequests);
        syncDeliverables(serviceId, deliverableRequests);
        syncServiceSkills(serviceId, technologyIds, ServiceSkillRelationType.TECHNOLOGY);
        syncServiceSkills(serviceId, skillIds, ServiceSkillRelationType.SKILL);
    }

    private void syncTranslations(UUID serviceId, List<ServiceTranslationRequest> requests) {
        translations.deleteByServiceId(serviceId);
        for (ServiceTranslationRequest request : safeList(requests)) {
            ProfessionalServiceTranslation translation = new ProfessionalServiceTranslation(UUID.randomUUID(), serviceId, request.languageCode());
            translation.update(request.title(), request.summary(), request.description(), request.problem(),
                    request.targetAudience(), request.ctaLabel());
            translations.save(translation);
        }
    }

    private void syncBenefits(UUID serviceId, List<BenefitRequest> requests) {
        for (ServiceBenefit benefit : benefits.findByServiceIdOrderByDisplayOrderAsc(serviceId)) {
            benefitTranslations.deleteByBenefitId(benefit.getId());
        }
        benefits.deleteByServiceId(serviceId);
        for (BenefitRequest request : safeList(requests)) {
            ServiceBenefit benefit = benefits.save(new ServiceBenefit(UUID.randomUUID(), serviceId, request.active(), request.displayOrder()));
            for (ServiceItemTranslationRequest translationRequest : safeList(request.translations())) {
                ServiceBenefitTranslation translation = new ServiceBenefitTranslation(UUID.randomUUID(), benefit.getId(), translationRequest.languageCode());
                translation.update(translationRequest.label(), translationRequest.description());
                benefitTranslations.save(translation);
            }
        }
    }

    private void syncDeliverables(UUID serviceId, List<DeliverableRequest> requests) {
        for (ServiceDeliverable deliverable : deliverables.findByServiceIdOrderByDisplayOrderAsc(serviceId)) {
            deliverableTranslations.deleteByDeliverableId(deliverable.getId());
        }
        deliverables.deleteByServiceId(serviceId);
        for (DeliverableRequest request : safeList(requests)) {
            ServiceDeliverable deliverable = deliverables.save(new ServiceDeliverable(UUID.randomUUID(), serviceId, request.active(), request.displayOrder()));
            for (ServiceItemTranslationRequest translationRequest : safeList(request.translations())) {
                ServiceDeliverableTranslation translation = new ServiceDeliverableTranslation(UUID.randomUUID(), deliverable.getId(), translationRequest.languageCode());
                translation.update(translationRequest.label(), translationRequest.description());
                deliverableTranslations.save(translation);
            }
        }
    }

    private void syncServiceSkills(UUID serviceId, List<UUID> ids, ServiceSkillRelationType relationType) {
        serviceSkills.findByServiceIdAndRelationTypeOrderByDisplayOrderAsc(serviceId, relationType)
                .forEach(serviceSkills::delete);
        int order = 0;
        for (UUID skillId : new LinkedHashSet<>(safeList(ids))) {
            if (!skills.existsById(skillId)) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "SKILL_NOT_FOUND", "A selected skill does not exist.");
            }
            serviceSkills.save(new ServiceSkill(serviceId, skillId, relationType, order));
            order += 10;
        }
    }

    private void syncStepTranslations(UUID stepId, List<WorkProcessStepTranslationRequest> requests) {
        stepTranslations.deleteByStepId(stepId);
        for (WorkProcessStepTranslationRequest request : safeList(requests)) {
            WorkProcessStepTranslation translation = new WorkProcessStepTranslation(UUID.randomUUID(), stepId, request.languageCode());
            translation.update(request.title(), request.description(), request.expectedResult());
            stepTranslations.save(translation);
        }
    }

    private void validateServiceRequest(String slug, ServiceCtaType ctaType, String ctaTarget, String visualUrl,
                                        List<ServiceTranslationRequest> translations,
                                        List<BenefitRequest> benefits,
                                        List<DeliverableRequest> deliverables,
                                        List<UUID> technologyIds,
                                        List<UUID> skillIds,
                                        UUID currentId) {
        ensureDistinctServiceLanguages(translations);
        for (BenefitRequest benefit : safeList(benefits)) {
            ensureDistinctItemLanguages(benefit.translations());
        }
        for (DeliverableRequest deliverable : safeList(deliverables)) {
            ensureDistinctItemLanguages(deliverable.translations());
        }
        validateCta(ctaType, ctaTarget);
        validateOptionalUrl(visualUrl, "The visual URL is invalid.");
        if (slug != null && !slug.trim().isBlank()) {
            String normalizedSlug = slug.trim().toLowerCase(java.util.Locale.ROOT);
            boolean slugTaken = currentId == null
                    ? services.existsBySlug(normalizedSlug)
                    : services.existsBySlugAndIdNot(normalizedSlug, currentId);
            if (slugTaken) {
                throw new ApiException(HttpStatus.CONFLICT, "SERVICE_SLUG_TAKEN", "This slug is already used by another service.");
            }
        }
        for (UUID skillId : safeList(technologyIds)) {
            if (!skills.existsById(skillId)) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "SKILL_NOT_FOUND", "A selected technology reference does not exist.");
            }
        }
        for (UUID skillId : safeList(skillIds)) {
            if (!skills.existsById(skillId)) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "SKILL_NOT_FOUND", "A selected skill reference does not exist.");
            }
        }
    }

    private void validateStepRequest(List<WorkProcessStepTranslationRequest> translations) {
        Set<String> languages = new LinkedHashSet<>();
        for (WorkProcessStepTranslationRequest request : safeList(translations)) {
            if (request.languageCode() != null && !languages.add(request.languageCode())) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "DUPLICATE_TRANSLATION", "Each language can be provided only once.");
            }
        }
    }

    private void validateCta(ServiceCtaType ctaType, String target) {
        if (ctaType == null) {
            return;
        }
        if (ctaType == ServiceCtaType.EMAIL) {
            if (target == null || !target.trim().matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "SERVICE_CTA_INVALID", "The email CTA target must be a valid email address.");
            }
        }
        if (ctaType == ServiceCtaType.EXTERNAL_URL) {
            validateOptionalUrl(target, "The external CTA URL is invalid.");
        }
        if ((ctaType == ServiceCtaType.CONTACT || ctaType == ServiceCtaType.PROJECTS || ctaType == ServiceCtaType.RESUME)
                && target != null && !target.trim().isBlank()) {
            validateOptionalUrl(target, "The CTA target URL is invalid.");
        }
    }

    private void ensureServicePublishable(UUID serviceId) {
        boolean translationReady = translations.findByServiceIdOrderByLanguageCode(serviceId).stream()
                .anyMatch(translation -> notBlank(translation.getTitle()) && notBlank(translation.getSummary()));
        if (!translationReady) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "SERVICE_NOT_PUBLISHABLE",
                    "At least one language must have a title and summary before publishing.");
        }
        boolean hasActiveBenefit = benefits.findByServiceIdOrderByDisplayOrderAsc(serviceId).stream()
                .filter(ServiceBenefit::isActive)
                .anyMatch(benefit -> benefitTranslations.findByBenefitIdOrderByLanguageCode(benefit.getId()).stream()
                        .anyMatch(translation -> notBlank(translation.getLabel())));
        boolean hasActiveDeliverable = deliverables.findByServiceIdOrderByDisplayOrderAsc(serviceId).stream()
                .filter(ServiceDeliverable::isActive)
                .anyMatch(deliverable -> deliverableTranslations.findByDeliverableIdOrderByLanguageCode(deliverable.getId()).stream()
                        .anyMatch(translation -> notBlank(translation.getLabel())));
        if (!hasActiveBenefit || !hasActiveDeliverable) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "SERVICE_NOT_PUBLISHABLE",
                    "A service needs at least one active benefit and one active deliverable before publishing.");
        }
    }

    private void ensureStepPublishable(UUID stepId) {
        boolean ready = stepTranslations.findByStepIdOrderByLanguageCode(stepId).stream()
                .anyMatch(translation -> notBlank(translation.getTitle()) && notBlank(translation.getDescription()));
        if (!ready) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "WORK_PROCESS_STEP_NOT_PUBLISHABLE",
                    "A work process step needs at least one title and description before publishing.");
        }
    }

    private void ensureDistinctServiceLanguages(List<ServiceTranslationRequest> requests) {
        Set<String> languages = new LinkedHashSet<>();
        for (ServiceTranslationRequest request : safeList(requests)) {
            if (request.languageCode() != null && !languages.add(request.languageCode())) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "DUPLICATE_TRANSLATION", "Each language can be provided only once.");
            }
        }
    }

    private void ensureDistinctItemLanguages(List<ServiceItemTranslationRequest> requests) {
        Set<String> languages = new LinkedHashSet<>();
        for (ServiceItemTranslationRequest request : safeList(requests)) {
            if (request.languageCode() != null && !languages.add(request.languageCode())) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "DUPLICATE_TRANSLATION", "Each item language can be provided only once.");
            }
        }
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

    private ProfessionalService requireService(UUID id) {
        return services.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "SERVICE_NOT_FOUND", "Service not found."));
    }

    private WorkProcessStep requireStep(UUID id) {
        return steps.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "WORK_PROCESS_STEP_NOT_FOUND", "Work process step not found."));
    }

    private String selectLanguage(String language) {
        return SUPPORTED_LANGUAGES.contains(language) ? language : "fr";
    }

    private Pageable pageable(Integer page, Integer size) {
        int safePage = page == null || page < 0 ? 0 : page;
        int safeSize = size == null || size <= 0 ? DEFAULT_PAGE_SIZE : Math.min(size, 48);
        return PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.ASC, "displayOrder"));
    }

    private boolean notBlank(String value) {
        return value != null && !value.trim().isBlank();
    }

    private <T> List<T> safeList(List<T> values) {
        return values == null ? new ArrayList<>() : values;
    }

    private void record(Authentication authentication, String action, String resourceType, String resourceId, HttpServletRequest request) {
        if (authentication == null) {
            return;
        }
        adminUsers.findByEmail(authentication.getName())
                .ifPresent(admin -> activityLog.record(admin, action, resourceType, resourceId, "SUCCESS", request));
    }
}
