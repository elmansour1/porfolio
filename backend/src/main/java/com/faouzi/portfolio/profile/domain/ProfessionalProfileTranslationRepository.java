package com.faouzi.portfolio.profile.domain;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessionalProfileTranslationRepository extends JpaRepository<ProfessionalProfileTranslation, UUID> {

    List<ProfessionalProfileTranslation> findByProfileIdOrderByLanguageCode(UUID profileId);

    Optional<ProfessionalProfileTranslation> findByProfileIdAndLanguageCode(UUID profileId, String languageCode);

    void deleteByProfileId(UUID profileId);
}
