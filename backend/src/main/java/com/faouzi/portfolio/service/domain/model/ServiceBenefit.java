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
@Table(name = "service_benefit")
public class ServiceBenefit {

    @Id
    private UUID id;

    @Column(name = "service_id", nullable = false)
    private UUID serviceId;

    @Column(nullable = false)
    private boolean active;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    public ServiceBenefit(UUID id, UUID serviceId, boolean active, int displayOrder) {
        this.id = id;
        this.serviceId = serviceId;
        this.active = active;
        this.displayOrder = displayOrder;
    }
}
