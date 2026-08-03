package com.faouzi.portfolio.service.domain.model;

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
@Table(name = "work_process_step_translation")
public class WorkProcessStepTranslation {

    @Id
    private UUID id;

    @Column(name = "step_id", nullable = false)
    private UUID stepId;

    @Column(name = "language_code", nullable = false, length = 2)
    private String languageCode;

    @Column(nullable = false, length = 180)
    private String title;

    @Column(columnDefinition = "text")
    private String description;

    @Column(name = "expected_result", length = 500)
    private String expectedResult;

    public WorkProcessStepTranslation(UUID id, UUID stepId, String languageCode) {
        this.id = id;
        this.stepId = stepId;
        this.languageCode = languageCode;
    }

    public void update(String title, String description, String expectedResult) {
        this.title = title == null ? "" : title.trim();
        this.description = description == null || description.trim().isBlank() ? null : description.trim();
        this.expectedResult = expectedResult == null || expectedResult.trim().isBlank() ? null : expectedResult.trim();
    }
}
