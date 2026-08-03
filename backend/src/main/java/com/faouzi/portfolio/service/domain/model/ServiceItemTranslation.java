package com.faouzi.portfolio.service.domain.model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@MappedSuperclass
public abstract class ServiceItemTranslation {

    @Id
    private UUID id;

    @Column(name = "language_code", nullable = false, length = 2)
    private String languageCode;

    @Column(nullable = false, length = 180)
    private String label;

    @Column(length = 500)
    private String description;

    protected ServiceItemTranslation(UUID id, String languageCode) {
        this.id = id;
        this.languageCode = languageCode;
    }

    public void update(String label, String description) {
        this.label = label == null ? "" : label.trim();
        this.description = description == null || description.trim().isBlank() ? null : description.trim();
    }
}
