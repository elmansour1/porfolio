package com.faouzi.portfolio.skills.application.mapper;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.faouzi.portfolio.profile.domain.model.PublicationStatus;
import com.faouzi.portfolio.skills.api.dto.response.PublicSkillsResponse;
import com.faouzi.portfolio.skills.api.dto.response.SkillCategoryResponse;
import com.faouzi.portfolio.skills.api.dto.response.SkillCategoryTranslationResponse;
import com.faouzi.portfolio.skills.api.dto.response.SkillMetadataResponse;
import com.faouzi.portfolio.skills.api.dto.response.SkillResponse;
import com.faouzi.portfolio.skills.api.dto.response.SkillTranslationResponse;
import com.faouzi.portfolio.skills.domain.model.Skill;
import com.faouzi.portfolio.skills.domain.model.SkillCategory;
import com.faouzi.portfolio.skills.domain.model.SkillCategoryTranslation;
import com.faouzi.portfolio.skills.domain.model.SkillLevel;
import com.faouzi.portfolio.skills.domain.model.SkillTranslation;
import com.faouzi.portfolio.skills.infrastructure.persistence.SkillCategoryTranslationRepository;
import com.faouzi.portfolio.skills.infrastructure.persistence.SkillRepository;
import com.faouzi.portfolio.skills.infrastructure.persistence.SkillTranslationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SkillCatalogMapper {

    private final SkillRepository skills;
    private final SkillCategoryTranslationRepository categoryTranslations;
    private final SkillTranslationRepository skillTranslations;

    public SkillCategoryResponse toCategoryResponse(SkillCategory category) {
        return new SkillCategoryResponse(
                category.getId(),
                category.getPublicationStatus(),
                category.getIcon(),
                category.getDisplayOrder(),
                skills.countByCategoryId(category.getId()),
                category.getCreatedAt(),
                category.getUpdatedAt(),
                categoryTranslations.findByCategoryIdOrderByLanguageCode(category.getId()).stream()
                        .map(this::toCategoryTranslationResponse)
                        .toList()
        );
    }

    public SkillResponse toSkillResponse(Skill skill) {
        return new SkillResponse(
                skill.getId(),
                skill.getCategoryId(),
                categoryTranslations.findByCategoryIdAndLanguageCode(skill.getCategoryId(), "fr")
                        .map(SkillCategoryTranslation::getName)
                        .orElse("Catégorie sans traduction FR"),
                skill.getPublicationStatus(),
                skill.getLevel(),
                skill.getIcon(),
                skill.isFeatured(),
                skill.isVisible(),
                skill.getDisplayOrder(),
                skill.getCreatedAt(),
                skill.getUpdatedAt(),
                skillTranslations.findBySkillIdOrderByLanguageCode(skill.getId()).stream()
                        .map(this::toSkillTranslationResponse)
                        .toList()
        );
    }

    public SkillMetadataResponse toMetadataResponse() {
        return new SkillMetadataResponse(
                List.of(
                        new SkillMetadataResponse.OptionResponse("Brouillon", PublicationStatus.DRAFT.name()),
                        new SkillMetadataResponse.OptionResponse("Publié", PublicationStatus.PUBLISHED.name()),
                        new SkillMetadataResponse.OptionResponse("Archivé", PublicationStatus.ARCHIVED.name())
                ),
                List.of(
                        new SkillMetadataResponse.OptionResponse("Notions", SkillLevel.NOTIONS.name()),
                        new SkillMetadataResponse.OptionResponse("Opérationnel", SkillLevel.OPERATIONAL.name()),
                        new SkillMetadataResponse.OptionResponse("Avancé", SkillLevel.ADVANCED.name()),
                        new SkillMetadataResponse.OptionResponse("Expertise principale", SkillLevel.CORE_EXPERTISE.name())
                )
        );
    }

    public Optional<PublicSkillsResponse.PublicSkillResponse> toPublicSkill(Skill skill, String language) {
        Optional<SkillTranslation> translation = skillTranslations.findBySkillIdAndLanguageCode(skill.getId(), language);
        if (translation.isEmpty() || !hasSkillPublicTranslation(translation.get())) {
            return Optional.empty();
        }
        return Optional.of(new PublicSkillsResponse.PublicSkillResponse(
                translation.get().getName(),
                translation.get().getDescription(),
                translation.get().getUsageSummary(),
                skill.getLevel() == null ? null : skill.getLevel().name(),
                skill.getIcon(),
                skill.isFeatured(),
                skill.getDisplayOrder()
        ));
    }

    public PublicSkillsResponse.PublicSkillCategoryResponse toPublicCategory(
            SkillCategory category,
            SkillCategoryTranslation translation,
            List<PublicSkillsResponse.PublicSkillResponse> skillResponses
    ) {
        return new PublicSkillsResponse.PublicSkillCategoryResponse(
                translation.getName(),
                translation.getDescription(),
                category.getIcon(),
                category.getDisplayOrder(),
                skillResponses.stream()
                        .sorted(Comparator.comparingInt(PublicSkillsResponse.PublicSkillResponse::displayOrder)
                                .thenComparing(PublicSkillsResponse.PublicSkillResponse::name))
                        .toList()
        );
    }

    public SkillCategoryTranslationResponse toCategoryTranslationResponse(SkillCategoryTranslation translation) {
        return new SkillCategoryTranslationResponse(translation.getLanguageCode(), translation.getName(), translation.getDescription());
    }

    public SkillTranslationResponse toSkillTranslationResponse(SkillTranslation translation) {
        return new SkillTranslationResponse(translation.getLanguageCode(), translation.getName(), translation.getDescription(), translation.getUsageSummary());
    }

    public boolean hasCategoryPublicTranslation(SkillCategoryTranslation translation) {
        return hasText(translation.getName());
    }

    private boolean hasSkillPublicTranslation(SkillTranslation translation) {
        return hasText(translation.getName()) && hasText(translation.getDescription());
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isBlank();
    }
}
