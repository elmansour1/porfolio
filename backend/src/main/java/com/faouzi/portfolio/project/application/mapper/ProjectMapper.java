package com.faouzi.portfolio.project.application.mapper;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.faouzi.portfolio.profile.domain.model.PublicationStatus;
import com.faouzi.portfolio.project.api.dto.response.ProjectLinkResponse;
import com.faouzi.portfolio.project.api.dto.response.ProjectMediaResponse;
import com.faouzi.portfolio.project.api.dto.response.ProjectMetadataResponse;
import com.faouzi.portfolio.project.api.dto.response.ProjectResponse;
import com.faouzi.portfolio.project.api.dto.response.ProjectSkillReferenceResponse;
import com.faouzi.portfolio.project.api.dto.response.ProjectTranslationResponse;
import com.faouzi.portfolio.project.api.dto.response.PublicProjectResponse;
import com.faouzi.portfolio.project.api.dto.response.PublicProjectSummaryResponse;
import com.faouzi.portfolio.project.domain.model.Project;
import com.faouzi.portfolio.project.domain.model.ProjectConfidentiality;
import com.faouzi.portfolio.project.domain.model.ProjectLink;
import com.faouzi.portfolio.project.domain.model.ProjectMedia;
import com.faouzi.portfolio.project.domain.model.ProjectMediaKind;
import com.faouzi.portfolio.project.domain.model.ProjectRealStatus;
import com.faouzi.portfolio.project.domain.model.ProjectSkill;
import com.faouzi.portfolio.project.domain.model.ProjectTranslation;
import com.faouzi.portfolio.project.domain.model.ProjectType;
import com.faouzi.portfolio.project.infrastructure.persistence.ProjectLinkRepository;
import com.faouzi.portfolio.project.infrastructure.persistence.ProjectMediaRepository;
import com.faouzi.portfolio.project.infrastructure.persistence.ProjectSkillRepository;
import com.faouzi.portfolio.project.infrastructure.persistence.ProjectTranslationRepository;
import com.faouzi.portfolio.skills.domain.model.Skill;
import com.faouzi.portfolio.skills.infrastructure.persistence.SkillCategoryTranslationRepository;
import com.faouzi.portfolio.skills.infrastructure.persistence.SkillRepository;
import com.faouzi.portfolio.skills.infrastructure.persistence.SkillTranslationRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProjectMapper {

    private final ProjectTranslationRepository translations;
    private final ProjectSkillRepository projectSkills;
    private final ProjectLinkRepository links;
    private final ProjectMediaRepository media;
    private final SkillRepository skills;
    private final SkillTranslationRepository skillTranslations;
    private final SkillCategoryTranslationRepository categoryTranslations;

    public ProjectResponse toResponse(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getSlug(),
                project.getProjectType(),
                project.getRealStatus(),
                project.getPublicationStatus(),
                project.getConfidentiality(),
                project.getStartDate(),
                project.getEndDate(),
                project.isOngoing(),
                project.isFeatured(),
                project.getDisplayOrder(),
                project.getDemoUrl(),
                project.getGithubUrl(),
                project.isIndexable(),
                project.getCreatedAt(),
                project.getUpdatedAt(),
                translations.findByProjectIdOrderByLanguageCode(project.getId())
                        .stream()
                        .map(this::toTranslationResponse)
                        .toList(),
                skillReferences(project.getId()),
                links.findByProjectIdOrderByDisplayOrderAsc(project.getId())
                        .stream()
                        .map(this::toLinkResponse)
                        .toList(),
                mediaResponses(project.getId(), true)
        );
    }

    public Optional<PublicProjectSummaryResponse> toPublicSummary(Project project, String language) {
        return translations.findByProjectIdAndLanguageCode(project.getId(), language)
                .filter(this::hasPublicTranslation)
                .map(translation -> new PublicProjectSummaryResponse(
                        project.getSlug(),
                        project.getProjectType().name(),
                        project.getRealStatus().name(),
                        translation.getTitle(),
                        translation.getSummary(),
                        coverUrl(project.getId()),
                        project.getStartDate(),
                        project.getEndDate(),
                        project.isOngoing(),
                        project.isFeatured(),
                        skillReferences(project.getId())
                ));
    }

    public Optional<PublicProjectResponse> toPublicDetail(Project project, String language, List<PublicProjectSummaryResponse> similarProjects) {
        return translations.findByProjectIdAndLanguageCode(project.getId(), language)
                .filter(this::hasPublicTranslation)
                .map(translation -> {
                    boolean anonymized = project.getConfidentiality() == ProjectConfidentiality.ANONYMIZED;
                    return new PublicProjectResponse(
                            project.getSlug(),
                            project.getProjectType().name(),
                            project.getRealStatus().name(),
                            project.getStartDate(),
                            project.getEndDate(),
                            project.isOngoing(),
                            translation.getTitle(),
                            translation.getSummary(),
                            translation.getDescription(),
                            translation.getContext(),
                            translation.getProblem(),
                            translation.getObjectives(),
                            translation.getTargetUsers(),
                            translation.getRole(),
                            translation.getResponsibilities(),
                            translation.getSolution(),
                            translation.getArchitectureNotes(),
                            translation.getFeatures(),
                            translation.getChallenges(),
                            translation.getDecisions(),
                            translation.getResults(),
                            translation.getSeoTitle(),
                            translation.getSeoDescription(),
                            coverUrl(project.getId()),
                            mediaResponses(project.getId(), false).stream()
                                    .filter(response -> "GALLERY".equals(response.kind()))
                                    .toList(),
                            skillReferences(project.getId()),
                            anonymized ? List.of() : links.findByProjectIdOrderByDisplayOrderAsc(project.getId()).stream().map(this::toLinkResponse).toList(),
                            anonymized ? null : project.getDemoUrl(),
                            anonymized ? null : project.getGithubUrl(),
                            similarProjects
                    );
                });
    }

    public ProjectMetadataResponse metadata() {
        return new ProjectMetadataResponse(
                List.of(
                        option("Brouillon", PublicationStatus.DRAFT),
                        option("Publié", PublicationStatus.PUBLISHED),
                        option("Archivé", PublicationStatus.ARCHIVED)
                ),
                List.of(
                        option("Application SaaS", ProjectType.SAAS_APPLICATION),
                        option("Plateforme métier", ProjectType.BUSINESS_PLATFORM),
                        option("API backend", ProjectType.BACKEND_API),
                        option("Tableau de bord", ProjectType.DASHBOARD),
                        option("Plateforme éducative", ProjectType.EDUCATIONAL_PLATFORM),
                        option("Système documentaire", ProjectType.DOCUMENTATION_SYSTEM),
                        option("Projet DevOps", ProjectType.DEVOPS_PROJECT),
                        option("Prototype", ProjectType.PROTOTYPE),
                        option("Audit technique", ProjectType.TECHNICAL_AUDIT),
                        option("Étude de design", ProjectType.DESIGN_STUDY),
                        option("Autre", ProjectType.OTHER)
                ),
                List.of(
                        option("En cours", ProjectRealStatus.IN_PROGRESS),
                        option("Terminé", ProjectRealStatus.COMPLETED),
                        option("Maintenu", ProjectRealStatus.MAINTAINED),
                        option("Prototype", ProjectRealStatus.PROTOTYPE),
                        option("Suspendu", ProjectRealStatus.SUSPENDED)
                ),
                List.of(
                        option("Public", ProjectConfidentiality.PUBLIC),
                        option("Anonymisé", ProjectConfidentiality.ANONYMIZED),
                        option("Privé", ProjectConfidentiality.PRIVATE)
                )
        );
    }

    private ProjectTranslationResponse toTranslationResponse(ProjectTranslation translation) {
        return new ProjectTranslationResponse(
                translation.getLanguageCode(),
                translation.getTitle(),
                translation.getSummary(),
                translation.getDescription(),
                translation.getContext(),
                translation.getProblem(),
                translation.getObjectives(),
                translation.getTargetUsers(),
                translation.getRole(),
                translation.getResponsibilities(),
                translation.getSolution(),
                translation.getArchitectureNotes(),
                translation.getFeatures(),
                translation.getChallenges(),
                translation.getDecisions(),
                translation.getResults(),
                translation.getSeoTitle(),
                translation.getSeoDescription()
        );
    }

    private ProjectLinkResponse toLinkResponse(ProjectLink link) {
        return new ProjectLinkResponse(link.getId(), link.getLabel(), link.getUrl(), link.getDisplayOrder());
    }

    private List<ProjectMediaResponse> mediaResponses(UUID projectId, boolean admin) {
        return media.findByProjectIdOrderByDisplayOrderAsc(projectId).stream()
                .map(item -> toMediaResponse(item, admin))
                .toList();
    }

    private ProjectMediaResponse toMediaResponse(ProjectMedia item, boolean admin) {
        String base = admin ? "/api/v1/admin/projects/media/" : "/api/v1/public/projects/media/";
        return new ProjectMediaResponse(
                item.getId(),
                item.getKind().name(),
                base + item.getId(),
                item.getAltText(),
                item.getCaption(),
                item.getDisplayOrder(),
                item.getOriginalFilename(),
                item.getSizeBytes()
        );
    }

    private String coverUrl(UUID projectId) {
        return media.findByProjectIdAndKind(projectId, ProjectMediaKind.COVER)
                .map(item -> "/api/v1/public/projects/media/" + item.getId())
                .orElse(null);
    }

    private List<ProjectSkillReferenceResponse> skillReferences(UUID projectId) {
        return projectSkills.findByProjectIdOrderByDisplayOrderAsc(projectId)
                .stream()
                .map(ProjectSkill::getSkillId)
                .map(this::skillReference)
                .flatMap(Optional::stream)
                .toList();
    }

    private Optional<ProjectSkillReferenceResponse> skillReference(UUID skillId) {
        return skills.findById(skillId)
                .map(skill -> new ProjectSkillReferenceResponse(
                        skill.getId(),
                        skillTranslations.findBySkillIdAndLanguageCode(skill.getId(), "fr")
                                .map(translation -> fallback(translation.getName(), "Compétence"))
                                .orElse("Compétence"),
                        categoryName(skill)
                ));
    }

    private String categoryName(Skill skill) {
        return categoryTranslations.findByCategoryIdAndLanguageCode(skill.getCategoryId(), "fr")
                .map(translation -> fallback(translation.getName(), "Catégorie"))
                .orElse("Catégorie");
    }

    private boolean hasPublicTranslation(ProjectTranslation translation) {
        return notBlank(translation.getTitle()) && notBlank(translation.getSummary());
    }

    private boolean notBlank(String value) {
        return value != null && !value.trim().isBlank();
    }

    private String fallback(String value, String fallback) {
        return notBlank(value) ? value : fallback;
    }

    private ProjectMetadataResponse.OptionResponse option(String label, Enum<?> value) {
        return new ProjectMetadataResponse.OptionResponse(label, value.name());
    }
}
