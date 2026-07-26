package com.faouzi.portfolio.profile.domain;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "portfolio_section_setting")
public class PortfolioSectionSetting {

    @Id
    @Column(name = "section_key", length = 40)
    private String sectionKey;

    @Column(nullable = false, length = 120)
    private String label;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(nullable = false)
    private boolean visible;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected PortfolioSectionSetting() {
    }

    public PortfolioSectionSetting(String sectionKey, String label, int displayOrder, boolean visible, Instant now) {
        this.sectionKey = sectionKey;
        this.label = label;
        this.displayOrder = displayOrder;
        this.visible = visible;
        this.updatedAt = now;
    }

    public void update(boolean visible, int displayOrder, Instant now) {
        this.visible = visible;
        this.displayOrder = displayOrder;
        this.updatedAt = now;
    }

    public String sectionKey() {
        return sectionKey;
    }

    public String label() {
        return label;
    }

    public int displayOrder() {
        return displayOrder;
    }

    public boolean visible() {
        return visible;
    }
}
