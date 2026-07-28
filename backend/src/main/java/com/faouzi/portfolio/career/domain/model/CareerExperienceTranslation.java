package com.faouzi.portfolio.career.domain.model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "career_experience_translation")
public class CareerExperienceTranslation {

    @Id
    private UUID id;

    @Column(name = "experience_id", nullable = false)
    private UUID experienceId;

    @Column(name = "language_code", nullable = false, length = 2)
    private String languageCode;

    @Column(length = 800)
    private String summary;

    @Column(columnDefinition = "text")
    private String missions;

    @Column(columnDefinition = "text")
    private String achievements;

    @Column(name = "confidential_label", length = 180)
    private String confidentialLabel;

    public CareerExperienceTranslation(UUID id, UUID experienceId, String languageCode) {
        this.id = id;
        this.experienceId = experienceId;
        this.languageCode = languageCode;
    }

    public void update(String summary, String missions, String achievements, String confidentialLabel) {
        this.summary = CareerExperience.blankToNull(summary);
        this.missions = CareerExperience.blankToNull(missions);
        this.achievements = CareerExperience.blankToNull(achievements);
        this.confidentialLabel = CareerExperience.blankToNull(confidentialLabel);
    }
}
