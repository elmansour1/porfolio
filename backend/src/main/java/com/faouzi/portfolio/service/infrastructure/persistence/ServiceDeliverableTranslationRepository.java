package com.faouzi.portfolio.service.infrastructure.persistence;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.faouzi.portfolio.service.domain.model.ServiceDeliverableTranslation;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceDeliverableTranslationRepository extends JpaRepository<ServiceDeliverableTranslation, UUID> {

    List<ServiceDeliverableTranslation> findByDeliverableIdOrderByLanguageCode(UUID deliverableId);

    Optional<ServiceDeliverableTranslation> findByDeliverableIdAndLanguageCode(UUID deliverableId, String languageCode);

    void deleteByDeliverableId(UUID deliverableId);
}
