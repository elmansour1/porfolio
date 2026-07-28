package com.faouzi.portfolio.profile.infrastructure.persistence;

import com.faouzi.portfolio.profile.domain.model.SiteSettings;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteSettingsRepository extends JpaRepository<SiteSettings, UUID> {
}
