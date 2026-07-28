package com.faouzi.portfolio.skills.infrastructure.persistence;

import com.faouzi.portfolio.skills.domain.model.Skill;

import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.profile.domain.model.PublicationStatus;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<Skill, UUID> {

    List<Skill> findAllByOrderByDisplayOrderAsc();

    List<Skill> findByCategoryIdOrderByDisplayOrderAsc(UUID categoryId);

    List<Skill> findByPublicationStatusAndVisibleTrueOrderByDisplayOrderAsc(PublicationStatus publicationStatus);

    long countByCategoryId(UUID categoryId);

    void deleteByCategoryId(UUID categoryId);
}
