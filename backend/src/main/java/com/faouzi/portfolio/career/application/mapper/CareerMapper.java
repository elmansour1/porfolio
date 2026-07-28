package com.faouzi.portfolio.career.application.mapper;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.faouzi.portfolio.career.api.dto.response.CareerCertificationResponse;
import com.faouzi.portfolio.career.api.dto.response.CareerCertificationTranslationResponse;
import com.faouzi.portfolio.career.api.dto.response.CareerEducationResponse;
import com.faouzi.portfolio.career.api.dto.response.CareerEducationTranslationResponse;
import com.faouzi.portfolio.career.api.dto.response.CareerExperienceResponse;
import com.faouzi.portfolio.career.api.dto.response.CareerExperienceTranslationResponse;
import com.faouzi.portfolio.career.api.dto.response.CareerMetadataResponse;
import com.faouzi.portfolio.career.api.dto.response.CareerSkillReferenceResponse;
import com.faouzi.portfolio.career.api.dto.response.PublicCareerResponse;
import com.faouzi.portfolio.career.domain.model.CareerCertification;
import com.faouzi.portfolio.career.domain.model.CareerCertificationTranslation;
import com.faouzi.portfolio.career.domain.model.CareerEducation;
import com.faouzi.portfolio.career.domain.model.CareerEducationTranslation;
import com.faouzi.portfolio.career.domain.model.CareerExperience;
import com.faouzi.portfolio.career.domain.model.CareerExperienceSkill;
import com.faouzi.portfolio.career.domain.model.CareerExperienceTranslation;
import com.faouzi.portfolio.career.domain.model.ContractType;
import com.faouzi.portfolio.career.domain.model.EducationLevel;
import com.faouzi.portfolio.career.domain.model.ExperienceType;
import com.faouzi.portfolio.career.domain.model.WorkMode;
import com.faouzi.portfolio.career.infrastructure.persistence.CareerCertificationTranslationRepository;
import com.faouzi.portfolio.career.infrastructure.persistence.CareerEducationTranslationRepository;
import com.faouzi.portfolio.career.infrastructure.persistence.CareerExperienceSkillRepository;
import com.faouzi.portfolio.career.infrastructure.persistence.CareerExperienceTranslationRepository;
import com.faouzi.portfolio.profile.domain.model.PublicationStatus;
import com.faouzi.portfolio.skills.domain.model.Skill;
import com.faouzi.portfolio.skills.infrastructure.persistence.SkillCategoryTranslationRepository;
import com.faouzi.portfolio.skills.infrastructure.persistence.SkillRepository;
import com.faouzi.portfolio.skills.infrastructure.persistence.SkillTranslationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CareerMapper {

    private final CareerExperienceTranslationRepository experienceTranslations;
    private final CareerExperienceSkillRepository experienceSkills;
    private final CareerEducationTranslationRepository educationTranslations;
    private final CareerCertificationTranslationRepository certificationTranslations;
    private final SkillRepository skills;
    private final SkillTranslationRepository skillTranslations;
    private final SkillCategoryTranslationRepository categoryTranslations;

    public CareerExperienceResponse toExperienceResponse(CareerExperience experience) {
        return new CareerExperienceResponse(
                experience.getId(),
                experience.getPublicationStatus(),
                experience.getExperienceType(),
                experience.getContractType(),
                experience.getOrganization(),
                experience.getRoleTitle(),
                experience.getLocation(),
                experience.getWorkMode(),
                experience.getStartDate(),
                experience.getEndDate(),
                experience.isCurrentPosition(),
                experience.isConfidential(),
                experience.getOrganizationUrl(),
                experience.getLogoMediaId(),
                experience.getDisplayOrder(),
                experience.getCreatedAt(),
                experience.getUpdatedAt(),
                experienceTranslations.findByExperienceIdOrderByLanguageCode(experience.getId())
                        .stream()
                        .map(this::toExperienceTranslationResponse)
                        .toList(),
                skillReferences(experience.getId())
        );
    }

    public CareerEducationResponse toEducationResponse(CareerEducation education) {
        return new CareerEducationResponse(
                education.getId(),
                education.getPublicationStatus(),
                education.getInstitution(),
                education.getEducationLevel(),
                education.getLocation(),
                education.getStartDate(),
                education.getEndDate(),
                education.isCurrentEducation(),
                education.getUrl(),
                education.getLogoMediaId(),
                education.getDisplayOrder(),
                education.getCreatedAt(),
                education.getUpdatedAt(),
                educationTranslations.findByEducationIdOrderByLanguageCode(education.getId())
                        .stream()
                        .map(this::toEducationTranslationResponse)
                        .toList()
        );
    }

    public CareerCertificationResponse toCertificationResponse(CareerCertification certification) {
        return new CareerCertificationResponse(
                certification.getId(),
                certification.getPublicationStatus(),
                certification.getIssuer(),
                certification.getIssueDate(),
                certification.getExpiryDate(),
                certification.isNoExpiry(),
                certification.getCredentialId(),
                certification.getVerificationUrl(),
                certification.getDocumentMediaId(),
                certification.getDisplayOrder(),
                certification.getCreatedAt(),
                certification.getUpdatedAt(),
                certificationTranslations.findByCertificationIdOrderByLanguageCode(certification.getId())
                        .stream()
                        .map(this::toCertificationTranslationResponse)
                        .toList()
        );
    }

    public Optional<PublicCareerResponse.PublicExperienceResponse> toPublicExperience(CareerExperience experience, String language) {
        return experienceTranslations.findByExperienceIdAndLanguageCode(experience.getId(), language)
                .filter(this::hasExperiencePublicTranslation)
                .map(translation -> new PublicCareerResponse.PublicExperienceResponse(
                        experience.getExperienceType().name(),
                        experience.getContractType() == null ? null : experience.getContractType().name(),
                        publicOrganization(experience, translation),
                        experience.getRoleTitle(),
                        experience.getLocation(),
                        experience.getWorkMode().name(),
                        experience.getStartDate(),
                        experience.getEndDate(),
                        experience.isCurrentPosition(),
                        experience.isConfidential(),
                        translation.getSummary(),
                        translation.getMissions(),
                        translation.getAchievements(),
                        experience.isConfidential() ? null : experience.getOrganizationUrl(),
                        experience.getDisplayOrder(),
                        skillReferences(experience.getId())
                ));
    }

    public Optional<PublicCareerResponse.PublicEducationResponse> toPublicEducation(CareerEducation education, String language) {
        return educationTranslations.findByEducationIdAndLanguageCode(education.getId(), language)
                .filter(this::hasEducationPublicTranslation)
                .map(translation -> new PublicCareerResponse.PublicEducationResponse(
                        education.getInstitution(),
                        education.getEducationLevel() == null ? null : education.getEducationLevel().name(),
                        education.getLocation(),
                        education.getStartDate(),
                        education.getEndDate(),
                        education.isCurrentEducation(),
                        translation.getTitle(),
                        translation.getField(),
                        translation.getDescription(),
                        education.getUrl(),
                        education.getDisplayOrder()
                ));
    }

    public Optional<PublicCareerResponse.PublicCertificationResponse> toPublicCertification(CareerCertification certification, String language) {
        return certificationTranslations.findByCertificationIdAndLanguageCode(certification.getId(), language)
                .filter(this::hasCertificationPublicTranslation)
                .map(translation -> new PublicCareerResponse.PublicCertificationResponse(
                        certification.getIssuer(),
                        certification.getIssueDate(),
                        certification.getExpiryDate(),
                        certification.isNoExpiry(),
                        certification.getCredentialId(),
                        certification.getVerificationUrl(),
                        translation.getName(),
                        translation.getDescription(),
                        certification.getDisplayOrder()
                ));
    }

    public CareerMetadataResponse metadata() {
        return new CareerMetadataResponse(
                List.of(
                        option("Brouillon", PublicationStatus.DRAFT),
                        option("Publié", PublicationStatus.PUBLISHED),
                        option("Archivé", PublicationStatus.ARCHIVED)
                ),
                List.of(
                        option("Emploi", ExperienceType.EMPLOYMENT),
                        option("Freelance", ExperienceType.FREELANCE),
                        option("Stage", ExperienceType.INTERNSHIP),
                        option("Mission", ExperienceType.MISSION),
                        option("Bénévolat professionnel", ExperienceType.VOLUNTEERING),
                        option("Autre", ExperienceType.OTHER)
                ),
                List.of(
                        option("CDI", ContractType.PERMANENT),
                        option("CDD", ContractType.FIXED_TERM),
                        option("Freelance", ContractType.FREELANCE),
                        option("Stage", ContractType.INTERNSHIP),
                        option("Alternance", ContractType.APPRENTICESHIP),
                        option("Autre", ContractType.OTHER)
                ),
                List.of(
                        option("Sur site", WorkMode.ON_SITE),
                        option("Hybride", WorkMode.HYBRID),
                        option("À distance", WorkMode.REMOTE)
                ),
                List.of(
                        option("Secondaire", EducationLevel.SECONDARY),
                        option("Licence", EducationLevel.BACHELOR),
                        option("Master", EducationLevel.MASTER),
                        option("Ingénierie", EducationLevel.ENGINEERING),
                        option("Doctorat", EducationLevel.DOCTORATE),
                        option("Formation professionnelle", EducationLevel.PROFESSIONAL_TRAINING),
                        option("Certificat", EducationLevel.CERTIFICATE),
                        option("Autre", EducationLevel.OTHER)
                )
        );
    }

    private CareerExperienceTranslationResponse toExperienceTranslationResponse(CareerExperienceTranslation translation) {
        return new CareerExperienceTranslationResponse(
                translation.getLanguageCode(),
                translation.getSummary(),
                translation.getMissions(),
                translation.getAchievements(),
                translation.getConfidentialLabel()
        );
    }

    private CareerEducationTranslationResponse toEducationTranslationResponse(CareerEducationTranslation translation) {
        return new CareerEducationTranslationResponse(
                translation.getLanguageCode(),
                translation.getTitle(),
                translation.getField(),
                translation.getDescription()
        );
    }

    private CareerCertificationTranslationResponse toCertificationTranslationResponse(CareerCertificationTranslation translation) {
        return new CareerCertificationTranslationResponse(
                translation.getLanguageCode(),
                translation.getName(),
                translation.getDescription()
        );
    }

    private List<CareerSkillReferenceResponse> skillReferences(UUID experienceId) {
        return experienceSkills.findByExperienceIdOrderByDisplayOrderAsc(experienceId)
                .stream()
                .map(CareerExperienceSkill::getSkillId)
                .map(this::skillReference)
                .flatMap(Optional::stream)
                .toList();
    }

    private Optional<CareerSkillReferenceResponse> skillReference(UUID skillId) {
        return skills.findById(skillId)
                .map(skill -> new CareerSkillReferenceResponse(
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

    private String publicOrganization(CareerExperience experience, CareerExperienceTranslation translation) {
        if (!experience.isConfidential()) {
            return experience.getOrganization();
        }
        return fallback(translation.getConfidentialLabel(), "Client confidentiel");
    }

    private boolean hasExperiencePublicTranslation(CareerExperienceTranslation translation) {
        return notBlank(translation.getSummary());
    }

    private boolean hasEducationPublicTranslation(CareerEducationTranslation translation) {
        return notBlank(translation.getTitle());
    }

    private boolean hasCertificationPublicTranslation(CareerCertificationTranslation translation) {
        return notBlank(translation.getName());
    }

    private boolean notBlank(String value) {
        return value != null && !value.trim().isBlank();
    }

    private String fallback(String value, String fallback) {
        return notBlank(value) ? value : fallback;
    }

    private CareerMetadataResponse.OptionResponse option(String label, Enum<?> value) {
        return new CareerMetadataResponse.OptionResponse(label, value.name());
    }
}
