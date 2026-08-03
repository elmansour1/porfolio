package com.faouzi.portfolio.service.infrastructure.persistence;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.faouzi.portfolio.profile.domain.model.PublicationStatus;
import com.faouzi.portfolio.service.domain.model.ProfessionalService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessionalServiceRepository extends JpaRepository<ProfessionalService, UUID> {

    Page<ProfessionalService> findByPublicationStatusOrderByDisplayOrderAsc(PublicationStatus status, Pageable pageable);

    Page<ProfessionalService> findByFeaturedOrderByDisplayOrderAsc(boolean featured, Pageable pageable);

    Page<ProfessionalService> findByPublicationStatusAndFeaturedOrderByDisplayOrderAsc(PublicationStatus status, boolean featured, Pageable pageable);

    List<ProfessionalService> findByPublicationStatusOrderByDisplayOrderAsc(PublicationStatus status);

    List<ProfessionalService> findByPublicationStatusAndFeaturedTrueOrderByDisplayOrderAsc(PublicationStatus status);

    Optional<ProfessionalService> findBySlugAndPublicationStatus(String slug, PublicationStatus status);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, UUID id);
}
