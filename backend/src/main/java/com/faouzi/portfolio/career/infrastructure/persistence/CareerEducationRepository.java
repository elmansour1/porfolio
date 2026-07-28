package com.faouzi.portfolio.career.infrastructure.persistence;

import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.career.domain.model.CareerEducation;
import com.faouzi.portfolio.profile.domain.model.PublicationStatus;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CareerEducationRepository extends JpaRepository<CareerEducation, UUID> {

    List<CareerEducation> findAllByOrderByDisplayOrderAscStartDateDesc();

    List<CareerEducation> findByPublicationStatusOrderByDisplayOrderAscStartDateDesc(PublicationStatus publicationStatus);
}
