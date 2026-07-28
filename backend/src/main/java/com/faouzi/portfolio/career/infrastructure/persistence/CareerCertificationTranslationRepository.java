package com.faouzi.portfolio.career.infrastructure.persistence;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.faouzi.portfolio.career.domain.model.CareerCertificationTranslation;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CareerCertificationTranslationRepository extends JpaRepository<CareerCertificationTranslation, UUID> {

    List<CareerCertificationTranslation> findByCertificationIdOrderByLanguageCode(UUID certificationId);

    Optional<CareerCertificationTranslation> findByCertificationIdAndLanguageCode(UUID certificationId, String languageCode);

    void deleteByCertificationId(UUID certificationId);
}
