package com.faouzi.portfolio.service.application.mapper;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.faouzi.portfolio.profile.domain.model.PublicationStatus;
import com.faouzi.portfolio.service.api.dto.response.BenefitResponse;
import com.faouzi.portfolio.service.api.dto.response.DeliverableResponse;
import com.faouzi.portfolio.service.api.dto.response.OptionResponse;
import com.faouzi.portfolio.service.api.dto.response.PublicServiceItemResponse;
import com.faouzi.portfolio.service.api.dto.response.ServiceAdminDetailResponse;
import com.faouzi.portfolio.service.api.dto.response.ServiceAdminSummaryResponse;
import com.faouzi.portfolio.service.api.dto.response.ServiceItemTranslationResponse;
import com.faouzi.portfolio.service.api.dto.response.ServiceMetadataResponse;
import com.faouzi.portfolio.service.api.dto.response.ServicePublicResponse;
import com.faouzi.portfolio.service.api.dto.response.ServiceReferenceResponse;
import com.faouzi.portfolio.service.api.dto.response.ServiceTranslationResponse;
import com.faouzi.portfolio.service.api.dto.response.WorkProcessStepAdminResponse;
import com.faouzi.portfolio.service.api.dto.response.WorkProcessStepPublicResponse;
import com.faouzi.portfolio.service.api.dto.response.WorkProcessStepTranslationResponse;
import com.faouzi.portfolio.service.domain.model.ProfessionalService;
import com.faouzi.portfolio.service.domain.model.ProfessionalServiceTranslation;
import com.faouzi.portfolio.service.domain.model.ServiceBenefit;
import com.faouzi.portfolio.service.domain.model.ServiceBenefitTranslation;
import com.faouzi.portfolio.service.domain.model.ServiceCtaType;
import com.faouzi.portfolio.service.domain.model.ServiceDeliverable;
import com.faouzi.portfolio.service.domain.model.ServiceDeliverableTranslation;
import com.faouzi.portfolio.service.domain.model.ServiceItemTranslation;
import com.faouzi.portfolio.service.domain.model.ServiceSkill;
import com.faouzi.portfolio.service.domain.model.ServiceSkillRelationType;
import com.faouzi.portfolio.service.domain.model.WorkProcessStep;
import com.faouzi.portfolio.service.domain.model.WorkProcessStepTranslation;
import com.faouzi.portfolio.service.infrastructure.persistence.ProfessionalServiceTranslationRepository;
import com.faouzi.portfolio.service.infrastructure.persistence.ServiceBenefitRepository;
import com.faouzi.portfolio.service.infrastructure.persistence.ServiceBenefitTranslationRepository;
import com.faouzi.portfolio.service.infrastructure.persistence.ServiceDeliverableRepository;
import com.faouzi.portfolio.service.infrastructure.persistence.ServiceDeliverableTranslationRepository;
import com.faouzi.portfolio.service.infrastructure.persistence.ServiceSkillRepository;
import com.faouzi.portfolio.service.infrastructure.persistence.WorkProcessStepTranslationRepository;
import com.faouzi.portfolio.skills.domain.model.Skill;
import com.faouzi.portfolio.skills.infrastructure.persistence.SkillCategoryTranslationRepository;
import com.faouzi.portfolio.skills.infrastructure.persistence.SkillRepository;
import com.faouzi.portfolio.skills.infrastructure.persistence.SkillTranslationRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProfessionalServiceMapper {

    private final ProfessionalServiceTranslationRepository translations;
    private final ServiceBenefitRepository benefits;
    private final ServiceBenefitTranslationRepository benefitTranslations;
    private final ServiceDeliverableRepository deliverables;
    private final ServiceDeliverableTranslationRepository deliverableTranslations;
    private final ServiceSkillRepository serviceSkills;
    private final WorkProcessStepTranslationRepository stepTranslations;
    private final SkillRepository skills;
    private final SkillTranslationRepository skillTranslations;
    private final SkillCategoryTranslationRepository categoryTranslations;

    public ServiceAdminSummaryResponse toAdminSummary(ProfessionalService service) {
        return new ServiceAdminSummaryResponse(
                service.getId(),
                service.getSlug(),
                translations.findByServiceIdAndLanguageCode(service.getId(), "fr")
                        .map(ProfessionalServiceTranslation::getTitle)
                        .orElse("Service sans titre"),
                service.getPublicationStatus(),
                service.isFeatured(),
                service.getDisplayOrder(),
                service.getIcon(),
                service.getCtaType(),
                service.getUpdatedAt(),
                references(service.getId(), ServiceSkillRelationType.TECHNOLOGY, "fr"),
                references(service.getId(), ServiceSkillRelationType.SKILL, "fr")
        );
    }

    public ServiceAdminDetailResponse toAdminDetail(ProfessionalService service) {
        return new ServiceAdminDetailResponse(
                service.getId(),
                service.getSlug(),
                service.getPublicationStatus(),
                service.isFeatured(),
                service.getDisplayOrder(),
                service.getIcon(),
                service.getVisualUrl(),
                service.getCtaType(),
                service.getCtaTarget(),
                service.getCreatedAt(),
                service.getUpdatedAt(),
                translations.findByServiceIdOrderByLanguageCode(service.getId()).stream().map(this::toTranslation).toList(),
                benefits.findByServiceIdOrderByDisplayOrderAsc(service.getId()).stream().map(this::toBenefit).toList(),
                deliverables.findByServiceIdOrderByDisplayOrderAsc(service.getId()).stream().map(this::toDeliverable).toList(),
                references(service.getId(), ServiceSkillRelationType.TECHNOLOGY, "fr"),
                references(service.getId(), ServiceSkillRelationType.SKILL, "fr")
        );
    }

    public Optional<ServicePublicResponse> toPublic(ProfessionalService service, String language) {
        return translations.findByServiceIdAndLanguageCode(service.getId(), language)
                .filter(this::hasPublicTranslation)
                .map(translation -> new ServicePublicResponse(
                        service.getSlug(),
                        translation.getTitle(),
                        translation.getSummary(),
                        translation.getDescription(),
                        translation.getProblem(),
                        translation.getTargetAudience(),
                        service.getIcon(),
                        service.getVisualUrl(),
                        service.isFeatured(),
                        service.getDisplayOrder(),
                        service.getCtaType(),
                        publicCtaTarget(service),
                        translation.getCtaLabel(),
                        publicBenefits(service.getId(), language),
                        publicDeliverables(service.getId(), language),
                        references(service.getId(), ServiceSkillRelationType.TECHNOLOGY, language),
                        references(service.getId(), ServiceSkillRelationType.SKILL, language)
                ));
    }

    public WorkProcessStepAdminResponse toAdminStep(WorkProcessStep step) {
        return new WorkProcessStepAdminResponse(
                step.getId(),
                step.getPublicationStatus(),
                step.getDisplayOrder(),
                step.getIcon(),
                step.getCreatedAt(),
                step.getUpdatedAt(),
                stepTranslations.findByStepIdOrderByLanguageCode(step.getId()).stream()
                        .map(this::toStepTranslation)
                        .toList()
        );
    }

    public Optional<WorkProcessStepPublicResponse> toPublicStep(WorkProcessStep step, String language) {
        return stepTranslations.findByStepIdAndLanguageCode(step.getId(), language)
                .filter(this::hasPublicStepTranslation)
                .map(translation -> new WorkProcessStepPublicResponse(
                        translation.getTitle(),
                        translation.getDescription(),
                        translation.getExpectedResult(),
                        step.getDisplayOrder(),
                        step.getIcon()
                ));
    }

    public ServiceMetadataResponse metadata() {
        List<ServiceReferenceResponse> skillOptions = skills.findAll().stream()
                .map(Skill::getId)
                .map(id -> reference(id, "fr"))
                .flatMap(Optional::stream)
                .toList();
        return new ServiceMetadataResponse(
                List.of(
                        option("Brouillon", PublicationStatus.DRAFT),
                        option("Publié", PublicationStatus.PUBLISHED),
                        option("Archivé", PublicationStatus.ARCHIVED)
                ),
                List.of(
                        option("Contact", ServiceCtaType.CONTACT),
                        option("Projets", ServiceCtaType.PROJECTS),
                        option("E-mail", ServiceCtaType.EMAIL),
                        option("CV", ServiceCtaType.RESUME),
                        option("Lien externe", ServiceCtaType.EXTERNAL_URL)
                ),
                skillOptions
        );
    }

    private ServiceTranslationResponse toTranslation(ProfessionalServiceTranslation translation) {
        return new ServiceTranslationResponse(
                translation.getLanguageCode(),
                translation.getTitle(),
                translation.getSummary(),
                translation.getDescription(),
                translation.getProblem(),
                translation.getTargetAudience(),
                translation.getCtaLabel()
        );
    }

    private BenefitResponse toBenefit(ServiceBenefit benefit) {
        return new BenefitResponse(
                benefit.getId(),
                benefit.isActive(),
                benefit.getDisplayOrder(),
                benefitTranslations.findByBenefitIdOrderByLanguageCode(benefit.getId()).stream()
                        .map(this::toItemTranslation)
                        .toList()
        );
    }

    private DeliverableResponse toDeliverable(ServiceDeliverable deliverable) {
        return new DeliverableResponse(
                deliverable.getId(),
                deliverable.isActive(),
                deliverable.getDisplayOrder(),
                deliverableTranslations.findByDeliverableIdOrderByLanguageCode(deliverable.getId()).stream()
                        .map(this::toItemTranslation)
                        .toList()
        );
    }

    private ServiceItemTranslationResponse toItemTranslation(ServiceItemTranslation translation) {
        return new ServiceItemTranslationResponse(
                translation.getLanguageCode(),
                translation.getLabel(),
                translation.getDescription()
        );
    }

    private WorkProcessStepTranslationResponse toStepTranslation(WorkProcessStepTranslation translation) {
        return new WorkProcessStepTranslationResponse(
                translation.getLanguageCode(),
                translation.getTitle(),
                translation.getDescription(),
                translation.getExpectedResult()
        );
    }

    private List<PublicServiceItemResponse> publicBenefits(UUID serviceId, String language) {
        return benefits.findByServiceIdOrderByDisplayOrderAsc(serviceId).stream()
                .filter(ServiceBenefit::isActive)
                .map(benefit -> benefitTranslations.findByBenefitIdAndLanguageCode(benefit.getId(), language)
                        .filter(this::hasPublicItemTranslation)
                        .map(translation -> new PublicServiceItemResponse(
                                translation.getLabel(),
                                translation.getDescription(),
                                benefit.getDisplayOrder()
                        )))
                .flatMap(Optional::stream)
                .toList();
    }

    private List<PublicServiceItemResponse> publicDeliverables(UUID serviceId, String language) {
        return deliverables.findByServiceIdOrderByDisplayOrderAsc(serviceId).stream()
                .filter(ServiceDeliverable::isActive)
                .map(deliverable -> deliverableTranslations.findByDeliverableIdAndLanguageCode(deliverable.getId(), language)
                        .filter(this::hasPublicItemTranslation)
                        .map(translation -> new PublicServiceItemResponse(
                                translation.getLabel(),
                                translation.getDescription(),
                                deliverable.getDisplayOrder()
                        )))
                .flatMap(Optional::stream)
                .toList();
    }

    private List<ServiceReferenceResponse> references(UUID serviceId, ServiceSkillRelationType relationType, String language) {
        return serviceSkills.findByServiceIdAndRelationTypeOrderByDisplayOrderAsc(serviceId, relationType)
                .stream()
                .map(ServiceSkill::getSkillId)
                .map(skillId -> reference(skillId, language))
                .flatMap(Optional::stream)
                .toList();
    }

    private Optional<ServiceReferenceResponse> reference(UUID skillId, String language) {
        return skills.findById(skillId)
                .map(skill -> new ServiceReferenceResponse(
                        skill.getId(),
                        skillTranslations.findBySkillIdAndLanguageCode(skill.getId(), language)
                                .map(translation -> fallback(translation.getName(), "Compétence"))
                                .orElseGet(() -> skillTranslations.findBySkillIdAndLanguageCode(skill.getId(), "fr")
                                        .map(translation -> fallback(translation.getName(), "Compétence"))
                                        .orElse("Compétence")),
                        categoryTranslations.findByCategoryIdAndLanguageCode(skill.getCategoryId(), language)
                                .map(translation -> fallback(translation.getName(), "Catégorie"))
                                .orElseGet(() -> categoryTranslations.findByCategoryIdAndLanguageCode(skill.getCategoryId(), "fr")
                                        .map(translation -> fallback(translation.getName(), "Catégorie"))
                                        .orElse("Catégorie"))
                ));
    }

    private String publicCtaTarget(ProfessionalService service) {
        if (service.getCtaType() == null) {
            return null;
        }
        return switch (service.getCtaType()) {
            case CONTACT -> "#contact";
            case PROJECTS -> "/projects";
            case RESUME, EMAIL, EXTERNAL_URL -> service.getCtaTarget();
        };
    }

    private boolean hasPublicTranslation(ProfessionalServiceTranslation translation) {
        return notBlank(translation.getTitle()) && notBlank(translation.getSummary());
    }

    private boolean hasPublicItemTranslation(ServiceItemTranslation translation) {
        return notBlank(translation.getLabel());
    }

    private boolean hasPublicStepTranslation(WorkProcessStepTranslation translation) {
        return notBlank(translation.getTitle()) && notBlank(translation.getDescription());
    }

    private String fallback(String value, String fallback) {
        return notBlank(value) ? value : fallback;
    }

    private boolean notBlank(String value) {
        return value != null && !value.trim().isBlank();
    }

    private OptionResponse option(String label, Enum<?> value) {
        return new OptionResponse(label, value.name());
    }
}
