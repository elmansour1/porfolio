package com.faouzi.portfolio.project.domain.model;

import java.io.Serializable;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "project_skill")
@IdClass(ProjectSkill.Key.class)
public class ProjectSkill {

    @Id
    @Column(name = "project_id")
    private UUID projectId;

    @Id
    @Column(name = "skill_id")
    private UUID skillId;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    public ProjectSkill(UUID projectId, UUID skillId, int displayOrder) {
        this.projectId = projectId;
        this.skillId = skillId;
        this.displayOrder = displayOrder;
    }

    public record Key(UUID projectId, UUID skillId) implements Serializable {
    }
}
