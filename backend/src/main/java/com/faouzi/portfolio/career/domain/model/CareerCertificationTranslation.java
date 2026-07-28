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
@Table(name = "career_certification_translation")
public class CareerCertificationTranslation {

    @Id
    private UUID id;

    @Column(name = "certification_id", nullable = false)
    private UUID certificationId;

    @Column(name = "language_code", nullable = false, length = 2)
    private String languageCode;

    @Column(length = 220)
    private String name;

    @Column(columnDefinition = "text")
    private String description;

    public CareerCertificationTranslation(UUID id, UUID certificationId, String languageCode) {
        this.id = id;
        this.certificationId = certificationId;
        this.languageCode = languageCode;
    }

    public void update(String name, String description) {
        this.name = CareerExperience.blankToNull(name);
        this.description = CareerExperience.blankToNull(description);
    }
}
