package com.faouzi.portfolio.career.infrastructure.persistence;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.faouzi.portfolio.career.domain.model.CareerExperienceTranslation;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CareerExperienceTranslationRepository extends JpaRepository<CareerExperienceTranslation, UUID> {

    List<CareerExperienceTranslation> findByExperienceIdOrderByLanguageCode(UUID experienceId);

    Optional<CareerExperienceTranslation> findByExperienceIdAndLanguageCode(UUID experienceId, String languageCode);

    void deleteByExperienceId(UUID experienceId);
}
