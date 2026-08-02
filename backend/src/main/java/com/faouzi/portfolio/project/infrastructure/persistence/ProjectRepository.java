package com.faouzi.portfolio.project.infrastructure.persistence;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.faouzi.portfolio.profile.domain.model.PublicationStatus;
import com.faouzi.portfolio.project.domain.model.Project;
import com.faouzi.portfolio.project.domain.model.ProjectConfidentiality;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findAllByOrderByDisplayOrderAsc();

    Page<Project> findByPublicationStatusOrderByDisplayOrderAsc(PublicationStatus status, Pageable pageable);

    Page<Project> findByPublicationStatusAndConfidentialityNotOrderByDisplayOrderAsc(
            PublicationStatus status, ProjectConfidentiality excludedConfidentiality, Pageable pageable);

    List<Project> findByPublicationStatusAndFeaturedTrueAndConfidentialityNotOrderByDisplayOrderAsc(
            PublicationStatus status, ProjectConfidentiality excludedConfidentiality);

    Optional<Project> findBySlug(String slug);

    Optional<Project> findBySlugAndPublicationStatusAndConfidentialityNot(
            String slug, PublicationStatus status, ProjectConfidentiality excludedConfidentiality);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, UUID id);
}
