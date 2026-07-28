package com.faouzi.portfolio.skills.infrastructure.persistence;

import com.faouzi.portfolio.skills.domain.model.SkillCategoryTranslation;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillCategoryTranslationRepository extends JpaRepository<SkillCategoryTranslation, UUID> {

    List<SkillCategoryTranslation> findByCategoryIdOrderByLanguageCode(UUID categoryId);

    Optional<SkillCategoryTranslation> findByCategoryIdAndLanguageCode(UUID categoryId, String languageCode);

    void deleteByCategoryId(UUID categoryId);
}
