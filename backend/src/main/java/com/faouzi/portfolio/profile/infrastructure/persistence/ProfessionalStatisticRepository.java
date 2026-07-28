package com.faouzi.portfolio.profile.infrastructure.persistence;

import com.faouzi.portfolio.profile.domain.model.ProfessionalStatistic;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessionalStatisticRepository extends JpaRepository<ProfessionalStatistic, UUID> {

    List<ProfessionalStatistic> findByProfileIdOrderByDisplayOrderAscLabelFrAsc(UUID profileId);

    void deleteByProfileId(UUID profileId);
}
