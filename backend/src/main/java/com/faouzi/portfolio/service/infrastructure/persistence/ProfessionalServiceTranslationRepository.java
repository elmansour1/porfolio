package com.faouzi.portfolio.service.infrastructure.persistence;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.faouzi.portfolio.service.domain.model.ProfessionalServiceTranslation;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessionalServiceTranslationRepository extends JpaRepository<ProfessionalServiceTranslation, UUID> {

    List<ProfessionalServiceTranslation> findByServiceIdOrderByLanguageCode(UUID serviceId);

    Optional<ProfessionalServiceTranslation> findByServiceIdAndLanguageCode(UUID serviceId, String languageCode);

    void deleteByServiceId(UUID serviceId);
}
