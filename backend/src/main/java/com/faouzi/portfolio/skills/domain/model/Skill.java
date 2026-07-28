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
@Table(name = "skill")
public class Skill {

    @Id
    private UUID id;

    @Column(name = "category_id", nullable = false)
    private UUID categoryId;

    @Enumerated(EnumType.STRING)
    @Column(name = "publication_status", nullable = false, length = 20)
    private PublicationStatus publicationStatus;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private SkillLevel level;

    @Column(length = 80)
    private String icon;

    @Column(nullable = false)
    private boolean featured;

    @Column(nullable = false)
    private boolean visible;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public Skill(UUID id, UUID categoryId, int displayOrder, Instant now) {
        this.id = id;
        this.categoryId = categoryId;
        this.publicationStatus = PublicationStatus.DRAFT;
        this.featured = false;
        this.visible = true;
        this.displayOrder = displayOrder;
        this.createdAt = now;
        this.updatedAt = now;
    }

    public void update(
            UUID categoryId,
            PublicationStatus publicationStatus,
            SkillLevel level,
            String icon,
            boolean featured,
            boolean visible,
            int displayOrder,
            Instant now
    ) {
        this.categoryId = categoryId;
        this.publicationStatus = publicationStatus;
        this.level = level;
        this.icon = blankToNull(icon);
        this.featured = featured;
        this.visible = visible;
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
