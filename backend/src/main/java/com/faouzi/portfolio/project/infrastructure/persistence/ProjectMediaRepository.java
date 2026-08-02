package com.faouzi.portfolio.project.infrastructure.persistence;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.faouzi.portfolio.project.domain.model.ProjectMedia;
import com.faouzi.portfolio.project.domain.model.ProjectMediaKind;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectMediaRepository extends JpaRepository<ProjectMedia, UUID> {

    List<ProjectMedia> findByProjectIdOrderByDisplayOrderAsc(UUID projectId);

    List<ProjectMedia> findByProjectIdAndKindOrderByDisplayOrderAsc(UUID projectId, ProjectMediaKind kind);

    Optional<ProjectMedia> findByProjectIdAndKind(UUID projectId, ProjectMediaKind kind);

    void deleteByProjectId(UUID projectId);
}
