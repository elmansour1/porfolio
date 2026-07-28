package com.faouzi.portfolio.skills.infrastructure.persistence;

import com.faouzi.portfolio.skills.domain.model.SkillTranslation;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillTranslationRepository extends JpaRepository<SkillTranslation, UUID> {

    List<SkillTranslation> findBySkillIdOrderByLanguageCode(UUID skillId);

    Optional<SkillTranslation> findBySkillIdAndLanguageCode(UUID skillId, String languageCode);

    void deleteBySkillId(UUID skillId);
}
