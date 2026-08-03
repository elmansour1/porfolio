package com.faouzi.portfolio.service.domain.model;

import java.time.Instant;
import java.util.UUID;

import com.faouzi.portfolio.profile.domain.model.PublicationStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "work_process_step")
public class WorkProcessStep {

    @Id
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "publication_status", nullable = false, length = 20)
    private PublicationStatus publicationStatus;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(length = 80)
    private String icon;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public WorkProcessStep(UUID id, int displayOrder, Instant now) {
        this.id = id;
        this.publicationStatus = PublicationStatus.DRAFT;
        this.displayOrder = displayOrder;
        this.createdAt = now;
        this.updatedAt = now;
    }

    public void update(int displayOrder, String icon, Instant now) {
        this.displayOrder = displayOrder;
        this.icon = icon == null || icon.trim().isBlank() ? null : icon.trim();
        this.updatedAt = now;
    }

    public void publish(Instant now) {
        this.publicationStatus = PublicationStatus.PUBLISHED;
        this.updatedAt = now;
    }

    public void unpublish(Instant now) {
        this.publicationStatus = PublicationStatus.DRAFT;
        this.updatedAt = now;
    }

    public void archive(Instant now) {
        this.publicationStatus = PublicationStatus.ARCHIVED;
        this.updatedAt = now;
    }

    public void reorder(int displayOrder, Instant now) {
        this.displayOrder = displayOrder;
        this.updatedAt = now;
    }
}
