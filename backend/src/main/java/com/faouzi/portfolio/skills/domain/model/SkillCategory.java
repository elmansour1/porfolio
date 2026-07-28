package com.faouzi.portfolio.skills.domain.model;

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
@Table(name = "skill_category")
public class SkillCategory {

    @Id
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "publication_status", nullable = false, length = 20)
    private PublicationStatus publicationStatus;

    @Column(length = 80)
    private String icon;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public SkillCategory(UUID id, int displayOrder, Instant now) {
        this.id = id;
        this.publicationStatus = PublicationStatus.DRAFT;
        this.displayOrder = displayOrder;
        this.createdAt = now;
        this.updatedAt = now;
    }

    public void update(PublicationStatus publicationStatus, String icon, int displayOrder, Instant now) {
        this.publicationStatus = publicationStatus;
        this.icon = blankToNull(icon);
        this.displayOrder = displayOrder;
        this.updatedAt = now;
    }

    public void reorder(int displayOrder, Instant now) {
        this.displayOrder = displayOrder;
        this.updatedAt = now;
    }

    private String blankToNull(String value) {
        return value == null || value.trim().isBlank() ? null : value.trim();
    }
}
