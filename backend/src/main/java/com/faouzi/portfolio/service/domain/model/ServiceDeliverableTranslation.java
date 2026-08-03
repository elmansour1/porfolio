package com.faouzi.portfolio.service.domain.model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "service_deliverable_translation")
public class ServiceDeliverableTranslation extends ServiceItemTranslation {

    @Column(name = "deliverable_id", nullable = false)
    private UUID deliverableId;

    public ServiceDeliverableTranslation(UUID id, UUID deliverableId, String languageCode) {
        super(id, languageCode);
        this.deliverableId = deliverableId;
    }
}
