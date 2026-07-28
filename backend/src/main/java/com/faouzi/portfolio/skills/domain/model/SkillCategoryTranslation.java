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
@Table(name = "skill_category_translation")
public class SkillCategoryTranslation {

    @Id
    private UUID id;

    @Column(name = "category_id", nullable = false)
    private UUID categoryId;

    @Column(name = "language_code", nullable = false, length = 2)
    private String languageCode;

    @Column(length = 160)
    private String name;

    @Column(length = 600)
    private String description;

    public SkillCategoryTranslation(UUID id, UUID categoryId, String languageCode) {
        this.id = id;
        this.categoryId = categoryId;
        this.languageCode = languageCode;
    }

    public void update(String name, String description) {
        this.name = blankToNull(name);
        this.description = blankToNull(description);
    }

    private String blankToNull(String value) {
        return value == null || value.trim().isBlank() ? null : value.trim();
    }
}
