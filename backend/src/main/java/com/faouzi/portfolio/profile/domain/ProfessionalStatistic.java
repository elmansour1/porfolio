package com.faouzi.portfolio.profile.domain;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "professional_statistic")
public class ProfessionalStatistic {

    @Id
    private UUID id;

    @Column(name = "profile_id", nullable = false)
    private UUID profileId;

    @Column(name = "stat_value", nullable = false, length = 80)
    private String value;

    @Column(name = "label_fr", nullable = false, length = 120)
    private String labelFr;

    @Column(name = "label_en", nullable = false, length = 120)
    private String labelEn;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(nullable = false)
    private boolean visible;

    protected ProfessionalStatistic() {
    }

    public ProfessionalStatistic(
            UUID id,
            UUID profileId,
            String value,
            String labelFr,
            String labelEn,
            int displayOrder,
            boolean visible
    ) {
        this.id = id;
        this.profileId = profileId;
        this.value = value.trim();
        this.labelFr = labelFr.trim();
        this.labelEn = labelEn.trim();
        this.displayOrder = displayOrder;
        this.visible = visible;
    }

    public UUID id() {
        return id;
    }

    public String value() {
        return value;
    }

    public String labelFr() {
        return labelFr;
    }

    public String labelEn() {
        return labelEn;
    }

    public int displayOrder() {
        return displayOrder;
    }

    public boolean visible() {
        return visible;
    }
}
