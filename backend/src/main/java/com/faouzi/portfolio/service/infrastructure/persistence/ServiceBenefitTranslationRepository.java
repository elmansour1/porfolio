package com.faouzi.portfolio.service.infrastructure.persistence;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.faouzi.portfolio.service.domain.model.ServiceBenefitTranslation;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceBenefitTranslationRepository extends JpaRepository<ServiceBenefitTranslation, UUID> {

    List<ServiceBenefitTranslation> findByBenefitIdOrderByLanguageCode(UUID benefitId);

    Optional<ServiceBenefitTranslation> findByBenefitIdAndLanguageCode(UUID benefitId, String languageCode);

    void deleteByBenefitId(UUID benefitId);
}
