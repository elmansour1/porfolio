package com.faouzi.portfolio.career.infrastructure.persistence;

import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.career.domain.model.CareerCertification;
import com.faouzi.portfolio.profile.domain.model.PublicationStatus;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CareerCertificationRepository extends JpaRepository<CareerCertification, UUID> {

    List<CareerCertification> findAllByOrderByDisplayOrderAscIssueDateDesc();

    List<CareerCertification> findByPublicationStatusOrderByDisplayOrderAscIssueDateDesc(PublicationStatus publicationStatus);
}
