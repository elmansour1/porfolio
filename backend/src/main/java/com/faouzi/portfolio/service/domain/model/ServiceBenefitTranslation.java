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
@Table(name = "service_benefit_translation")
public class ServiceBenefitTranslation extends ServiceItemTranslation {

    @Column(name = "benefit_id", nullable = false)
    private UUID benefitId;

    public ServiceBenefitTranslation(UUID id, UUID benefitId, String languageCode) {
        super(id, languageCode);
        this.benefitId = benefitId;
    }
}
