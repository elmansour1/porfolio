package com.faouzi.portfolio.profile.infrastructure.persistence;

import com.faouzi.portfolio.profile.domain.model.ProfileMedia;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileMediaRepository extends JpaRepository<ProfileMedia, UUID> {
}
