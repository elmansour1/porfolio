package com.faouzi.portfolio.profile.infrastructure.persistence;

import com.faouzi.portfolio.profile.domain.model.ProfessionalProfile;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessionalProfileRepository extends JpaRepository<ProfessionalProfile, UUID> {
}
