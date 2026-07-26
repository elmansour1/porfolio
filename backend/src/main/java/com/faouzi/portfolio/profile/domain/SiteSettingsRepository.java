package com.faouzi.portfolio.profile.domain;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteSettingsRepository extends JpaRepository<SiteSettings, UUID> {
}
