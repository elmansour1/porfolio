package com.faouzi.portfolio.career.domain.model;

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
@Table(name = "career_experience_skill")
@IdClass(CareerExperienceSkill.Key.class)
public class CareerExperienceSkill {

    @Id
    @Column(name = "experience_id")
    private UUID experienceId;

    @Id
    @Column(name = "skill_id")
    private UUID skillId;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    public CareerExperienceSkill(UUID experienceId, UUID skillId, int displayOrder) {
        this.experienceId = experienceId;
        this.skillId = skillId;
        this.displayOrder = displayOrder;
    }

    public record Key(UUID experienceId, UUID skillId) implements Serializable {
    }
}
