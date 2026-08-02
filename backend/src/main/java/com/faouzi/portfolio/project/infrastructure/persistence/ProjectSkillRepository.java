package com.faouzi.portfolio.project.infrastructure.persistence;

import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.project.domain.model.ProjectSkill;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectSkillRepository extends JpaRepository<ProjectSkill, ProjectSkill.Key> {

    List<ProjectSkill> findByProjectIdOrderByDisplayOrderAsc(UUID projectId);

    void deleteByProjectId(UUID projectId);
}
