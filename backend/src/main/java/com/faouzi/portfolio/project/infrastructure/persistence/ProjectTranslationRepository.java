package com.faouzi.portfolio.project.infrastructure.persistence;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.faouzi.portfolio.project.domain.model.ProjectTranslation;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectTranslationRepository extends JpaRepository<ProjectTranslation, UUID> {

    List<ProjectTranslation> findByProjectIdOrderByLanguageCode(UUID projectId);

    Optional<ProjectTranslation> findByProjectIdAndLanguageCode(UUID projectId, String languageCode);

    void deleteByProjectId(UUID projectId);
}
