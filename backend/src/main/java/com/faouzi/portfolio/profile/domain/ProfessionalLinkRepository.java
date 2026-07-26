package com.faouzi.portfolio.profile.domain;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessionalLinkRepository extends JpaRepository<ProfessionalLink, UUID> {

    List<ProfessionalLink> findByProfileIdOrderByDisplayOrderAscLabelAsc(UUID profileId);

    void deleteByProfileId(UUID profileId);
}
