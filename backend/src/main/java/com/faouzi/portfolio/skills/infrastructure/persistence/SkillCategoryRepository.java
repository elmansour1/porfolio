package com.faouzi.portfolio.skills.infrastructure.persistence;

import com.faouzi.portfolio.skills.domain.model.SkillCategory;

import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.profile.domain.model.PublicationStatus;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillCategoryRepository extends JpaRepository<SkillCategory, UUID> {

    List<SkillCategory> findAllByOrderByDisplayOrderAsc();

    List<SkillCategory> findByPublicationStatusOrderByDisplayOrderAsc(PublicationStatus publicationStatus);
}
