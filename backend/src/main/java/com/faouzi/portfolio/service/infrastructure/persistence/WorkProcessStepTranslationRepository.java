package com.faouzi.portfolio.service.infrastructure.persistence;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.faouzi.portfolio.service.domain.model.WorkProcessStepTranslation;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkProcessStepTranslationRepository extends JpaRepository<WorkProcessStepTranslation, UUID> {

    List<WorkProcessStepTranslation> findByStepIdOrderByLanguageCode(UUID stepId);

    Optional<WorkProcessStepTranslation> findByStepIdAndLanguageCode(UUID stepId, String languageCode);

    void deleteByStepId(UUID stepId);
}
