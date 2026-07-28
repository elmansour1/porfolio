package com.faouzi.portfolio.career.infrastructure.persistence;

import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.career.domain.model.CareerExperience;
import com.faouzi.portfolio.profile.domain.model.PublicationStatus;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CareerExperienceRepository extends JpaRepository<CareerExperience, UUID> {

    List<CareerExperience> findAllByOrderByDisplayOrderAscStartDateDesc();

    List<CareerExperience> findByPublicationStatusOrderByDisplayOrderAscStartDateDesc(PublicationStatus publicationStatus);
}
