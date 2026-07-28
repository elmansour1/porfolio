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
@Table(name = "career_education_translation")
public class CareerEducationTranslation {

    @Id
    private UUID id;

    @Column(name = "education_id", nullable = false)
    private UUID educationId;

    @Column(name = "language_code", nullable = false, length = 2)
    private String languageCode;

    @Column(length = 220)
    private String title;

    @Column(length = 180)
    private String field;

    @Column(columnDefinition = "text")
    private String description;

    public CareerEducationTranslation(UUID id, UUID educationId, String languageCode) {
        this.id = id;
        this.educationId = educationId;
        this.languageCode = languageCode;
    }

    public void update(String title, String field, String description) {
        this.title = CareerExperience.blankToNull(title);
        this.field = CareerExperience.blankToNull(field);
        this.description = CareerExperience.blankToNull(description);
    }
}
