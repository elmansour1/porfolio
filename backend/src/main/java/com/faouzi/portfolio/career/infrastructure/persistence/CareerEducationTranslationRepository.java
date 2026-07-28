package com.faouzi.portfolio.career.infrastructure.persistence;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.faouzi.portfolio.career.domain.model.CareerEducationTranslation;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CareerEducationTranslationRepository extends JpaRepository<CareerEducationTranslation, UUID> {

    List<CareerEducationTranslation> findByEducationIdOrderByLanguageCode(UUID educationId);

    Optional<CareerEducationTranslation> findByEducationIdAndLanguageCode(UUID educationId, String languageCode);

    void deleteByEducationId(UUID educationId);
}
