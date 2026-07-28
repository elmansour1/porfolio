package com.faouzi.portfolio.skills.domain.model;

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
@Table(name = "skill_translation")
public class SkillTranslation {

    @Id
    private UUID id;

    @Column(name = "skill_id", nullable = false)
    private UUID skillId;

    @Column(name = "language_code", nullable = false, length = 2)
    private String languageCode;

    @Column(length = 160)
    private String name;

    @Column(length = 600)
    private String description;

    @Column(name = "usage_summary", length = 600)
    private String usageSummary;

    public SkillTranslation(UUID id, UUID skillId, String languageCode) {
        this.id = id;
        this.skillId = skillId;
        this.languageCode = languageCode;
    }

    public void update(String name, String description, String usageSummary) {
        this.name = blankToNull(name);
        this.description = blankToNull(description);
        this.usageSummary = blankToNull(usageSummary);
    }

    private String blankToNull(String value) {
        return value == null || value.trim().isBlank() ? null : value.trim();
    }
}
