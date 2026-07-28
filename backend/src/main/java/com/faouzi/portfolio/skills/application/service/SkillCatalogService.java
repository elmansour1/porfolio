package com.faouzi.portfolio.skills.application.service;

import java.time.Clock;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import com.faouzi.portfolio.audit.application.service.ActivityLogService;
import com.faouzi.portfolio.auth.domain.model.AdminUser;
import com.faouzi.portfolio.auth.infrastructure.persistence.AdminUserRepository;
import com.faouzi.portfolio.profile.domain.model.PublicationStatus;
import com.faouzi.portfolio.skills.api.dto.response.PublicSkillsResponse;
import com.faouzi.portfolio.skills.api.dto.request.SkillCategoryRequest;
import com.faouzi.portfolio.skills.api.dto.response.SkillCategoryResponse;
import com.faouzi.portfolio.skills.api.dto.request.SkillCategoryTranslationRequest;
import com.faouzi.portfolio.skills.api.dto.response.SkillMetadataResponse;
import com.faouzi.portfolio.skills.api.dto.request.SkillRequest;
import com.faouzi.portfolio.skills.api.dto.response.SkillResponse;
import com.faouzi.portfolio.skills.api.dto.request.SkillTranslationRequest;
import com.faouzi.portfolio.skills.application.mapper.SkillCatalogMapper;
import com.faouzi.portfolio.skills.domain.model.Skill;
import com.faouzi.portfolio.skills.domain.model.SkillCategory;
import com.faouzi.portfolio.skills.infrastructure.persistence.SkillCategoryRepository;
import com.faouzi.portfolio.skills.domain.model.SkillCategoryTranslation;
import com.faouzi.portfolio.skills.infrastructure.persistence.SkillCategoryTranslationRepository;
import com.faouzi.portfolio.skills.infrastructure.persistence.SkillRepository;
import com.faouzi.portfolio.skills.domain.model.SkillTranslation;
import com.faouzi.portfolio.skills.infrastructure.persistence.SkillTranslationRepository;
import com.faouzi.portfolio.shared.error.ApiException;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SkillCatalogService {

    private static final List<String> SUPPORTED_LANGUAGES = List.of("fr", "en");

    private final SkillCategoryRepository categories;
    private final SkillCategoryTranslationRepository categoryTranslations;
    private final SkillRepository skills;
    private final SkillTranslationRepository skillTranslations;
    private final AdminUserRepository adminUsers;
    private final ActivityLogService activityLog;
    private final SkillCatalogMapper mapper;
    private final Clock clock;

    @Transactional(readOnly = true)
    public List<SkillCategoryResponse> adminCategories() {
        return categories.findAllByOrderByDisplayOrderAsc().stream()
                .map(mapper::toCategoryResponse)
                .toList();
    }

    @Transactional
    public SkillCategoryResponse createCategory(SkillCategoryRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        validateCategoryRequest(request);
        SkillCategory category = new SkillCategory(UUID.randomUUID(), request.displayOrder(), clock.instant());
        category.update(request.publicationStatus(), request.icon(), request.displayOrder(), clock.instant());
        categories.save(category);
        replaceCategoryTranslations(category.getId(), request.translations());
        record(authentication, "SKILL_CATEGORY_CREATED", "skill_category", category.getId().toString(), httpRequest);
        return mapper.toCategoryResponse(category);
    }

    @Transactional
    public SkillCategoryResponse updateCategory(UUID id, SkillCategoryRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        validateCategoryRequest(request);
        SkillCategory category = requireCategory(id);
        category.update(request.publicationStatus(), request.icon(), request.displayOrder(), clock.instant());
        categories.save(category);
        replaceCategoryTranslations(category.getId(), request.translations());
        record(authentication, "SKILL_CATEGORY_UPDATED", "skill_category", category.getId().toString(), httpRequest);
        return mapper.toCategoryResponse(category);
    }

    @Transactional
    public SkillCategoryResponse publishCategory(UUID id, Authentication authentication, HttpServletRequest request) {
        return changeCategoryStatus(id, PublicationStatus.PUBLISHED, "SKILL_CATEGORY_PUBLISHED", authentication, request);
    }

    @Transactional
    public SkillCategoryResponse archiveCategory(UUID id, Authentication authentication, HttpServletRequest request) {
        SkillCategoryResponse response = changeCategoryStatus(id, PublicationStatus.ARCHIVED, "SKILL_CATEGORY_ARCHIVED", authentication, request);
        for (Skill skill : skills.findByCategoryIdOrderByDisplayOrderAsc(id)) {
            skill.update(skill.getCategoryId(), PublicationStatus.ARCHIVED, skill.getLevel(), skill.getIcon(), skill.isFeatured(), skill.isVisible(), skill.getDisplayOrder(), clock.instant());
            skills.save(skill);
        }
        return response;
    }

    @Transactional
    public void deleteCategory(UUID id, Authentication authentication, HttpServletRequest request) {
        long skillCount = skills.countByCategoryId(id);
        if (skillCount > 0) {
            throw new ApiException(HttpStatus.CONFLICT, "CATEGORY_NOT_EMPTY", "A skill category containing skills cannot be deleted.");
        }
        if (!categories.existsById(id)) {
            throw notFound("CATEGORY_NOT_FOUND", "Skill category not found.");
        }
        categoryTranslations.deleteByCategoryId(id);
        categories.deleteById(id);
        record(authentication, "SKILL_CATEGORY_DELETED", "skill_category", id.toString(), request);
    }

    @Transactional(readOnly = true)
    public List<SkillResponse> adminSkills(UUID categoryId, PublicationStatus status, Boolean featured, String query) {
        String normalizedQuery = normalizeFilter(query);
        return skills.findAllByOrderByDisplayOrderAsc().stream()
                .filter(skill -> categoryId == null || skill.getCategoryId().equals(categoryId))
                .filter(skill -> status == null || skill.getPublicationStatus() == status)
                .filter(skill -> featured == null || skill.isFeatured() == featured)
                .filter(skill -> matchesQuery(skill.getId(), normalizedQuery))
                .map(mapper::toSkillResponse)
                .toList();
    }

    @Transactional
    public SkillResponse createSkill(SkillRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        validateSkillRequest(request);
        ensureCategoryCanReceiveSkill(request.categoryId());
        Skill skill = new Skill(UUID.randomUUID(), request.categoryId(), request.displayOrder(), clock.instant());
        skill.update(
                request.categoryId(),
                request.publicationStatus(),
                request.level(),
                request.icon(),
                request.featured(),
                request.visible(),
                request.displayOrder(),
                clock.instant()
        );
        skills.save(skill);
        replaceSkillTranslations(skill.getId(), request.translations());
        record(authentication, "SKILL_CREATED", "skill", skill.getId().toString(), httpRequest);
        return mapper.toSkillResponse(skill);
    }

    @Transactional
    public SkillResponse updateSkill(UUID id, SkillRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        validateSkillRequest(request);
        ensureCategoryCanReceiveSkill(request.categoryId());
        Skill skill = requireSkill(id);
        skill.update(
                request.categoryId(),
                request.publicationStatus(),
                request.level(),
                request.icon(),
                request.featured(),
                request.visible(),
                request.displayOrder(),
                clock.instant()
        );
        skills.save(skill);
        replaceSkillTranslations(skill.getId(), request.translations());
        record(authentication, "SKILL_UPDATED", "skill", skill.getId().toString(), httpRequest);
        return mapper.toSkillResponse(skill);
    }

    @Transactional
    public SkillResponse publishSkill(UUID id, Authentication authentication, HttpServletRequest request) {
        Skill skill = requireSkill(id);
        ensureCategoryPublished(skill.getCategoryId());
        skill.update(skill.getCategoryId(), PublicationStatus.PUBLISHED, skill.getLevel(), skill.getIcon(), skill.isFeatured(), skill.isVisible(), skill.getDisplayOrder(), clock.instant());
        skills.save(skill);
        record(authentication, "SKILL_PUBLISHED", "skill", skill.getId().toString(), request);
        return mapper.toSkillResponse(skill);
    }

    @Transactional
    public SkillResponse archiveSkill(UUID id, Authentication authentication, HttpServletRequest request) {
        Skill skill = requireSkill(id);
        skill.update(skill.getCategoryId(), PublicationStatus.ARCHIVED, skill.getLevel(), skill.getIcon(), skill.isFeatured(), skill.isVisible(), skill.getDisplayOrder(), clock.instant());
        skills.save(skill);
        record(authentication, "SKILL_ARCHIVED", "skill", skill.getId().toString(), request);
        return mapper.toSkillResponse(skill);
    }

    @Transactional
    public void deleteSkill(UUID id, Authentication authentication, HttpServletRequest request) {
        if (!skills.existsById(id)) {
            throw notFound("SKILL_NOT_FOUND", "Skill not found.");
        }
        skillTranslations.deleteBySkillId(id);
        skills.deleteById(id);
        record(authentication, "SKILL_DELETED", "skill", id.toString(), request);
    }

    @Transactional(readOnly = true)
    public SkillMetadataResponse metadata() {
        return mapper.toMetadataResponse();
    }

    @Transactional(readOnly = true)
    public PublicSkillsResponse publicSkills(String language) {
        String selectedLanguage = SUPPORTED_LANGUAGES.contains(language) ? language : "fr";
        List<SkillCategory> publishedCategories = categories.findByPublicationStatusOrderByDisplayOrderAsc(PublicationStatus.PUBLISHED);
        List<Skill> publishedSkills = skills.findByPublicationStatusAndVisibleTrueOrderByDisplayOrderAsc(PublicationStatus.PUBLISHED);
        Map<UUID, List<Skill>> skillsByCategory = publishedSkills.stream()
                .collect(Collectors.groupingBy(Skill::getCategoryId, LinkedHashMap::new, Collectors.toList()));

        List<PublicSkillsResponse.PublicSkillCategoryResponse> categoryResponses = new ArrayList<>();
        List<PublicSkillsResponse.PublicSkillResponse> featuredResponses = new ArrayList<>();

        for (SkillCategory category : publishedCategories) {
            Optional<SkillCategoryTranslation> categoryTranslation =
                    categoryTranslations.findByCategoryIdAndLanguageCode(category.getId(), selectedLanguage);
            if (categoryTranslation.isEmpty() || !mapper.hasCategoryPublicTranslation(categoryTranslation.get())) {
                continue;
            }
            List<PublicSkillsResponse.PublicSkillResponse> skillResponses = skillsByCategory
                    .getOrDefault(category.getId(), List.of())
                    .stream()
                    .map(skill -> mapper.toPublicSkill(skill, selectedLanguage))
                    .flatMap(Optional::stream)
                    .sorted(Comparator.comparingInt(PublicSkillsResponse.PublicSkillResponse::displayOrder)
                            .thenComparing(PublicSkillsResponse.PublicSkillResponse::name))
                    .toList();
            if (skillResponses.isEmpty()) {
                continue;
            }
            skillResponses.stream().filter(PublicSkillsResponse.PublicSkillResponse::featured).forEach(featuredResponses::add);
            categoryResponses.add(mapper.toPublicCategory(category, categoryTranslation.get(), skillResponses));
        }

        return new PublicSkillsResponse(
                selectedLanguage,
                categoryResponses,
                featuredResponses.stream()
                        .sorted(Comparator.comparingInt(PublicSkillsResponse.PublicSkillResponse::displayOrder)
                                .thenComparing(PublicSkillsResponse.PublicSkillResponse::name))
                        .toList()
        );
    }

    private void replaceCategoryTranslations(UUID categoryId, List<SkillCategoryTranslationRequest> requests) {
        categoryTranslations.deleteByCategoryId(categoryId);
        for (SkillCategoryTranslationRequest request : safeList(requests)) {
            SkillCategoryTranslation translation = new SkillCategoryTranslation(UUID.randomUUID(), categoryId, request.languageCode());
            translation.update(request.name(), request.description());
            categoryTranslations.save(translation);
        }
    }

    private void replaceSkillTranslations(UUID skillId, List<SkillTranslationRequest> requests) {
        skillTranslations.deleteBySkillId(skillId);
        for (SkillTranslationRequest request : safeList(requests)) {
            SkillTranslation translation = new SkillTranslation(UUID.randomUUID(), skillId, request.languageCode());
            translation.update(request.name(), request.description(), request.usageSummary());
            skillTranslations.save(translation);
        }
    }

    private SkillCategoryResponse changeCategoryStatus(UUID id, PublicationStatus status, String action, Authentication authentication, HttpServletRequest request) {
        SkillCategory category = requireCategory(id);
        category.update(status, category.getIcon(), category.getDisplayOrder(), clock.instant());
        categories.save(category);
        record(authentication, action, "skill_category", category.getId().toString(), request);
        return mapper.toCategoryResponse(category);
    }

    private SkillCategory requireCategory(UUID id) {
        return categories.findById(id).orElseThrow(() -> notFound("CATEGORY_NOT_FOUND", "Skill category not found."));
    }

    private Skill requireSkill(UUID id) {
        return skills.findById(id).orElseThrow(() -> notFound("SKILL_NOT_FOUND", "Skill not found."));
    }

    private void ensureCategoryCanReceiveSkill(UUID categoryId) {
        requireCategory(categoryId);
    }

    private void ensureCategoryPublished(UUID categoryId) {
        SkillCategory category = requireCategory(categoryId);
        if (category.getPublicationStatus() != PublicationStatus.PUBLISHED) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "CATEGORY_NOT_PUBLISHED", "A skill cannot be published under an unpublished category.");
        }
    }

    private boolean matchesQuery(UUID skillId, String query) {
        if (query == null) {
            return true;
        }
        return skillTranslations.findBySkillIdOrderByLanguageCode(skillId)
                .stream()
                .anyMatch(translation -> contains(translation.getName(), query)
                        || contains(translation.getDescription(), query)
                        || contains(translation.getUsageSummary(), query));
    }

    private boolean contains(String value, String query) {
        return value != null && value.toLowerCase().contains(query);
    }

    private String normalizeFilter(String value) {
        return value == null || value.trim().isBlank() ? null : value.trim().toLowerCase();
    }

    private void validateCategoryRequest(SkillCategoryRequest request) {
        ensureDistinctLanguages(request.translations());
    }

    private void validateSkillRequest(SkillRequest request) {
        ensureDistinctLanguages(request.translations());
    }

    private void ensureDistinctLanguages(List<? extends Object> requests) {
        List<String> languageCodes = new ArrayList<>();
        for (Object request : safeList(requests)) {
            if (request instanceof SkillCategoryTranslationRequest translation) {
                languageCodes.add(translation.languageCode());
            }
            if (request instanceof SkillTranslationRequest translation) {
                languageCodes.add(translation.languageCode());
            }
        }
        if (languageCodes.stream().filter(Objects::nonNull).distinct().count() != languageCodes.size()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "DUPLICATE_TRANSLATION", "Each language can be provided only once.");
        }
    }

    private <T> List<T> safeList(List<T> values) {
        return values == null ? List.of() : values;
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
