package com.faouzi.portfolio.project.infrastructure.persistence;

import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.project.domain.model.ProjectLink;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectLinkRepository extends JpaRepository<ProjectLink, UUID> {

    List<ProjectLink> findByProjectIdOrderByDisplayOrderAsc(UUID projectId);

    void deleteByProjectId(UUID projectId);
}
