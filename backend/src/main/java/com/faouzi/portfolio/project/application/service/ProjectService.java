package com.faouzi.portfolio.project.application.service;

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
import com.faouzi.portfolio.project.api.dto.request.ProjectLinkRequest;
import com.faouzi.portfolio.project.api.dto.request.ProjectRequest;
import com.faouzi.portfolio.project.api.dto.request.ProjectTranslationRequest;
import com.faouzi.portfolio.project.api.dto.response.ProjectMetadataResponse;
import com.faouzi.portfolio.project.api.dto.response.ProjectResponse;
import com.faouzi.portfolio.project.api.dto.response.PublicProjectResponse;
import com.faouzi.portfolio.project.api.dto.response.PublicProjectSummaryResponse;
import com.faouzi.portfolio.project.application.dto.ProjectMediaFile;
import com.faouzi.portfolio.project.application.mapper.ProjectMapper;
import com.faouzi.portfolio.project.domain.model.Project;
import com.faouzi.portfolio.project.domain.model.ProjectConfidentiality;
import com.faouzi.portfolio.project.domain.model.ProjectLink;
import com.faouzi.portfolio.project.domain.model.ProjectMedia;
import com.faouzi.portfolio.project.domain.model.ProjectMediaKind;
import com.faouzi.portfolio.project.domain.model.ProjectSkill;
import com.faouzi.portfolio.project.domain.model.ProjectTranslation;
import com.faouzi.portfolio.project.infrastructure.persistence.ProjectLinkRepository;
import com.faouzi.portfolio.project.infrastructure.persistence.ProjectMediaRepository;
import com.faouzi.portfolio.project.infrastructure.persistence.ProjectRepository;
import com.faouzi.portfolio.project.infrastructure.persistence.ProjectSkillRepository;
import com.faouzi.portfolio.project.infrastructure.persistence.ProjectTranslationRepository;
import com.faouzi.portfolio.project.infrastructure.storage.ProjectMediaStorageService;
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
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private static final List<String> SUPPORTED_LANGUAGES = List.of("fr", "en");
    private static final int DEFAULT_PAGE_SIZE = 12;
    private static final int MAX_SIMILAR_PROJECTS = 3;

    private final ProjectRepository projects;
    private final ProjectTranslationRepository translations;
    private final ProjectSkillRepository projectSkills;
    private final ProjectLinkRepository links;
    private final ProjectMediaRepository media;
    private final SkillRepository skills;
    private final AdminUserRepository adminUsers;
    private final ActivityLogService activityLog;
    private final ProjectMapper mapper;
    private final ProjectMediaStorageService mediaStorage;
    private final Clock clock;

    @Transactional(readOnly = true)
    public PageResponse<ProjectResponse> adminList(PublicationStatus status, Integer page, Integer size) {
        Pageable pageable = pageable(page, size, Sort.by(Sort.Direction.ASC, "displayOrder"));
        Page<Project> result = status == null
                ? projects.findAll(pageable)
                : projects.findByPublicationStatusOrderByDisplayOrderAsc(status, pageable);
        return PageResponse.of(result.map(mapper::toResponse));
    }

    @Transactional(readOnly = true)
    public ProjectResponse adminDetail(UUID id) {
        return mapper.toResponse(requireProject(id));
    }

    @Transactional(readOnly = true)
    public ProjectMetadataResponse metadata() {
        return mapper.metadata();
    }

    @Transactional
    public ProjectResponse create(ProjectRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        validateRequest(request, null);
        Project project = new Project(UUID.randomUUID(), request.slug(), request.displayOrder(), clock.instant());
        applyProject(project, request);
        projects.save(project);
        syncTranslations(project.getId(), request.translations());
        syncSkills(project.getId(), request.skillIds());
        syncLinks(project.getId(), request.links());
        record(authentication, "PROJECT_CREATED", project.getId().toString(), httpRequest);
        return mapper.toResponse(project);
    }

    @Transactional
    public ProjectResponse update(UUID id, ProjectRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        validateRequest(request, id);
        Project project = requireProject(id);
        applyProject(project, request);
        projects.save(project);
        syncTranslations(project.getId(), request.translations());
        syncSkills(project.getId(), request.skillIds());
        syncLinks(project.getId(), request.links());
        record(authentication, "PROJECT_UPDATED", project.getId().toString(), httpRequest);
        return mapper.toResponse(project);
    }

    @Transactional
    public void delete(UUID id, Authentication authentication, HttpServletRequest httpRequest) {
        Project project = requireProject(id);
        for (ProjectMedia item : media.findByProjectIdOrderByDisplayOrderAsc(id)) {
            mediaStorage.delete(item);
        }
        links.deleteByProjectId(id);
        projectSkills.deleteByProjectId(id);
        translations.deleteByProjectId(id);
        projects.delete(project);
        record(authentication, "PROJECT_DELETED", id.toString(), httpRequest);
    }

    @Transactional
    public ProjectResponse publish(UUID id, Authentication authentication, HttpServletRequest httpRequest) {
        Project project = requireProject(id);
        ensureHasPublishableTranslation(project);
        project.publish(clock.instant());
        record(authentication, "PROJECT_PUBLISHED", id.toString(), httpRequest);
        return mapper.toResponse(project);
    }

    @Transactional
    public ProjectResponse unpublish(UUID id, Authentication authentication, HttpServletRequest httpRequest) {
        Project project = requireProject(id);
        project.unpublish(clock.instant());
        record(authentication, "PROJECT_UNPUBLISHED", id.toString(), httpRequest);
        return mapper.toResponse(project);
    }

    @Transactional
    public ProjectResponse archive(UUID id, Authentication authentication, HttpServletRequest httpRequest) {
        Project project = requireProject(id);
        project.archive(clock.instant());
        record(authentication, "PROJECT_ARCHIVED", id.toString(), httpRequest);
        return mapper.toResponse(project);
    }

    @Transactional
    public ProjectResponse setFeatured(UUID id, boolean featured, Authentication authentication, HttpServletRequest httpRequest) {
        Project project = requireProject(id);
        project.setFeatured(featured, clock.instant());
        record(authentication, featured ? "PROJECT_FEATURED" : "PROJECT_UNFEATURED", id.toString(), httpRequest);
        return mapper.toResponse(project);
    }

    @Transactional
    public ProjectResponse reorder(UUID id, int displayOrder, Authentication authentication, HttpServletRequest httpRequest) {
        Project project = requireProject(id);
        project.reorder(displayOrder, clock.instant());
        record(authentication, "PROJECT_REORDERED", id.toString(), httpRequest);
        return mapper.toResponse(project);
    }

    @Transactional
    public ProjectResponse uploadMedia(
            UUID id,
            MultipartFile file,
            ProjectMediaKind kind,
            String altText,
            String caption,
            Authentication authentication,
            HttpServletRequest httpRequest
    ) {
        Project project = requireProject(id);
        if (kind == ProjectMediaKind.COVER) {
            media.findByProjectIdAndKind(id, ProjectMediaKind.COVER).ifPresent(mediaStorage::delete);
        } else {
            long galleryCount = media.findByProjectIdAndKindOrderByDisplayOrderAsc(id, ProjectMediaKind.GALLERY).size();
            if (galleryCount >= 12) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "PROJECT_GALLERY_FULL", "The gallery already contains the maximum number of images.");
            }
        }
        int displayOrder = kind == ProjectMediaKind.COVER
                ? 0
                : media.findByProjectIdAndKindOrderByDisplayOrderAsc(id, ProjectMediaKind.GALLERY).size() * 10;
        mediaStorage.store(project.getId(), file, kind, altText, caption, displayOrder);
        record(authentication, "PROJECT_MEDIA_UPLOADED", id.toString(), httpRequest);
        return mapper.toResponse(project);
    }

    @Transactional
    public ProjectResponse deleteMedia(UUID projectId, UUID mediaId, Authentication authentication, HttpServletRequest httpRequest) {
        Project project = requireProject(projectId);
        ProjectMedia item = media.findById(mediaId)
                .filter(candidate -> candidate.getProjectId().equals(projectId))
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MEDIA_NOT_FOUND", "Media not found."));
        mediaStorage.delete(item);
        record(authentication, "PROJECT_MEDIA_DELETED", projectId.toString(), httpRequest);
        return mapper.toResponse(project);
    }

    @Transactional
    public ProjectResponse reorderGalleryMedia(UUID projectId, List<UUID> orderedMediaIds, Authentication authentication, HttpServletRequest httpRequest) {
        Project project = requireProject(projectId);
        List<ProjectMedia> gallery = media.findByProjectIdAndKindOrderByDisplayOrderAsc(projectId, ProjectMediaKind.GALLERY);
        Map<UUID, ProjectMedia> byId = new LinkedHashMap<>();
        gallery.forEach(item -> byId.put(item.getId(), item));
        int order = 0;
        for (UUID mediaId : safeList(orderedMediaIds)) {
            ProjectMedia item = byId.remove(mediaId);
            if (item != null) {
                item.reorder(order);
                media.save(item);
                order += 10;
            }
        }
        record(authentication, "PROJECT_MEDIA_REORDERED", projectId.toString(), httpRequest);
        return mapper.toResponse(project);
    }

    @Transactional(readOnly = true)
    public ProjectMediaFile readAdminMedia(UUID mediaId) {
        ProjectMedia item = media.findById(mediaId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MEDIA_NOT_FOUND", "Media not found."));
        return mediaStorage.read(item);
    }

    @Transactional(readOnly = true)
    public ProjectMediaFile readPublicMedia(UUID mediaId) {
        ProjectMedia item = media.findById(mediaId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MEDIA_NOT_FOUND", "Media not found."));
        Project project = projects.findById(item.getProjectId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MEDIA_NOT_FOUND", "Media not found."));
        if (project.getPublicationStatus() != PublicationStatus.PUBLISHED || project.getConfidentiality() == ProjectConfidentiality.PRIVATE) {
            throw new ApiException(HttpStatus.NOT_FOUND, "MEDIA_NOT_FOUND", "Media not found.");
        }
        return mediaStorage.read(item);
    }

    @Transactional(readOnly = true)
    public PageResponse<PublicProjectSummaryResponse> publicList(String language, Integer page, Integer size, UUID skillId) {
        String selectedLanguage = selectLanguage(language);
        Pageable pageable = pageable(page, size, Sort.by(Sort.Direction.ASC, "displayOrder"));
        Page<Project> result = projects.findByPublicationStatusAndConfidentialityNotOrderByDisplayOrderAsc(
                PublicationStatus.PUBLISHED, ProjectConfidentiality.PRIVATE, pageable);
        List<PublicProjectSummaryResponse> items = result.getContent().stream()
                .map(project -> mapper.toPublicSummary(project, selectedLanguage))
                .flatMap(java.util.Optional::stream)
                .filter(summary -> skillId == null || summary.skills().stream().anyMatch(skill -> skill.id().equals(skillId)))
                .toList();
        return new PageResponse<>(items, result.getNumber(), result.getSize(), result.getTotalElements(), result.getTotalPages());
    }

    @Transactional(readOnly = true)
    public List<PublicProjectSummaryResponse> publicFeatured(String language) {
        String selectedLanguage = selectLanguage(language);
        return projects.findByPublicationStatusAndFeaturedTrueAndConfidentialityNotOrderByDisplayOrderAsc(
                        PublicationStatus.PUBLISHED, ProjectConfidentiality.PRIVATE)
                .stream()
                .map(project -> mapper.toPublicSummary(project, selectedLanguage))
                .flatMap(java.util.Optional::stream)
                .toList();
    }

    @Transactional(readOnly = true)
    public PublicProjectResponse publicDetail(String slug, String language) {
        String selectedLanguage = selectLanguage(language);
        Project project = projects.findBySlugAndPublicationStatusAndConfidentialityNot(
                        slug, PublicationStatus.PUBLISHED, ProjectConfidentiality.PRIVATE)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "PROJECT_NOT_FOUND", "Project not found."));
        List<PublicProjectSummaryResponse> similar = similarProjects(project, selectedLanguage);
        return mapper.toPublicDetail(project, selectedLanguage, similar)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "PROJECT_NOT_FOUND", "Project not found."));
    }

    private List<PublicProjectSummaryResponse> similarProjects(Project project, String language) {
        Set<UUID> skillIds = projectSkills.findByProjectIdOrderByDisplayOrderAsc(project.getId())
                .stream().map(ProjectSkill::getSkillId).collect(java.util.stream.Collectors.toSet());
        if (skillIds.isEmpty()) {
            return List.of();
        }
        return projects.findByPublicationStatusAndConfidentialityNotOrderByDisplayOrderAsc(
                        PublicationStatus.PUBLISHED, ProjectConfidentiality.PRIVATE, Pageable.unpaged())
                .stream()
                .filter(candidate -> !candidate.getId().equals(project.getId()))
                .filter(candidate -> projectSkills.findByProjectIdOrderByDisplayOrderAsc(candidate.getId())
                        .stream().anyMatch(link -> skillIds.contains(link.getSkillId())))
                .map(candidate -> mapper.toPublicSummary(candidate, language))
                .flatMap(java.util.Optional::stream)
                .limit(MAX_SIMILAR_PROJECTS)
                .toList();
    }

    private void applyProject(Project project, ProjectRequest request) {
        project.update(
                request.slug(),
                request.projectType(),
                request.realStatus(),
                request.publicationStatus(),
                request.confidentiality(),
                request.startDate(),
                request.endDate(),
                request.ongoing(),
                request.featured(),
                request.displayOrder(),
                request.demoUrl(),
                request.githubUrl(),
                request.indexable(),
                clock.instant()
        );
    }

    private void syncTranslations(UUID projectId, List<ProjectTranslationRequest> requests) {
        Map<String, ProjectTranslation> existing = new LinkedHashMap<>();
        for (ProjectTranslation translation : translations.findByProjectIdOrderByLanguageCode(projectId)) {
            existing.put(translation.getLanguageCode(), translation);
        }
        for (ProjectTranslationRequest request : safeList(requests)) {
            ProjectTranslation translation = existing.remove(request.languageCode());
            if (translation == null) {
                translation = new ProjectTranslation(UUID.randomUUID(), projectId, request.languageCode());
            }
            translation.update(
                    request.title(), request.summary(), request.description(), request.context(),
                    request.problem(), request.objectives(), request.targetUsers(), request.role(),
                    request.responsibilities(), request.solution(), request.architectureNotes(),
                    request.features(), request.challenges(), request.decisions(), request.results(),
                    request.seoTitle(), request.seoDescription()
            );
            translations.save(translation);
        }
        translations.deleteAll(existing.values());
    }

    private void syncSkills(UUID projectId, List<UUID> skillIds) {
        projectSkills.deleteByProjectId(projectId);
        int order = 0;
        for (UUID skillId : new LinkedHashSet<>(safeList(skillIds))) {
            if (!skills.existsById(skillId)) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "SKILL_NOT_FOUND", "A selected skill does not exist.");
            }
            projectSkills.save(new ProjectSkill(projectId, skillId, order));
            order += 10;
        }
    }

    private void syncLinks(UUID projectId, List<ProjectLinkRequest> requests) {
        links.deleteByProjectId(projectId);
        for (ProjectLinkRequest request : safeList(requests)) {
            links.save(new ProjectLink(UUID.randomUUID(), projectId, request.label().trim(), request.url().trim(), request.displayOrder()));
        }
    }

    private void validateRequest(ProjectRequest request, UUID currentId) {
        ensureDistinctLanguages(request.translations());
        validateOptionalUrl(request.demoUrl(), "Demo URL is invalid.");
        validateOptionalUrl(request.githubUrl(), "GitHub URL is invalid.");
        for (ProjectLinkRequest link : safeList(request.links())) {
            validateOptionalUrl(link.url(), "Link URL is invalid.");
        }
        String normalizedSlug = request.slug() == null ? "" : request.slug().trim().toLowerCase(java.util.Locale.ROOT);
        boolean slugTaken = currentId == null
                ? projects.existsBySlug(normalizedSlug)
                : projects.existsBySlugAndIdNot(normalizedSlug, currentId);
        if (slugTaken) {
            throw new ApiException(HttpStatus.CONFLICT, "PROJECT_SLUG_TAKEN", "This slug is already used by another project.");
        }
    }

    private void ensureHasPublishableTranslation(Project project) {
        boolean publishable = translations.findByProjectIdOrderByLanguageCode(project.getId()).stream()
                .anyMatch(translation -> notBlank(translation.getTitle()) && notBlank(translation.getSummary()));
        if (!publishable) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "PROJECT_NOT_PUBLISHABLE", "At least one language must have a title and a summary before publishing.");
        }
    }

    private void ensureDistinctLanguages(List<ProjectTranslationRequest> requests) {
        Set<String> languages = new LinkedHashSet<>();
        for (ProjectTranslationRequest request : safeList(requests)) {
            if (request.languageCode() != null && !languages.add(request.languageCode())) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "DUPLICATE_TRANSLATION", "Each language can be provided only once.");
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

    private boolean notBlank(String value) {
        return value != null && !value.trim().isBlank();
    }

    private String selectLanguage(String language) {
        return SUPPORTED_LANGUAGES.contains(language) ? language : "fr";
    }

    private Pageable pageable(Integer page, Integer size, Sort sort) {
        int safePage = page == null || page < 0 ? 0 : page;
        int safeSize = size == null || size <= 0 ? DEFAULT_PAGE_SIZE : Math.min(size, 48);
        return PageRequest.of(safePage, safeSize, sort);
    }

    private Project requireProject(UUID id) {
        return projects.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "PROJECT_NOT_FOUND", "Project not found."));
    }

    private <T> List<T> safeList(List<T> values) {
        return values == null ? new ArrayList<>() : values;
    }

    private void record(Authentication authentication, String action, String resourceId, HttpServletRequest request) {
        if (authentication == null) {
            return;
        }
        adminUsers.findByEmail(authentication.getName())
                .ifPresent(admin -> activityLog.record(admin, action, "project", resourceId, "SUCCESS", request));
    }
}
