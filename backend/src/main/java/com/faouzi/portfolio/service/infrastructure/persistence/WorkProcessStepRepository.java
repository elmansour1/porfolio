package com.faouzi.portfolio.service.infrastructure.persistence;

import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.profile.domain.model.PublicationStatus;
import com.faouzi.portfolio.service.domain.model.WorkProcessStep;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkProcessStepRepository extends JpaRepository<WorkProcessStep, UUID> {

    List<WorkProcessStep> findAllByOrderByDisplayOrderAsc();

    List<WorkProcessStep> findByPublicationStatusOrderByDisplayOrderAsc(PublicationStatus status);
}
