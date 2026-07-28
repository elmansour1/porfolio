package com.faouzi.portfolio.profile.domain.model;

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

}
