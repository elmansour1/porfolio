package com.faouzi.portfolio.profile.domain;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "professional_link")
public class ProfessionalLink {

    @Id
    private UUID id;

    @Column(name = "profile_id", nullable = false)
    private UUID profileId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private ProfessionalLinkType type;

    @Column(nullable = false, length = 120)
    private String label;

    @Column(nullable = false, length = 500)
    private String url;

    @Column(length = 80)
    private String icon;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(nullable = false)
    private boolean visible;

    @Column(name = "open_in_new_tab", nullable = false)
    private boolean openInNewTab;

    protected ProfessionalLink() {
    }

    public ProfessionalLink(
            UUID id,
            UUID profileId,
            ProfessionalLinkType type,
            String label,
            String url,
            String icon,
            int displayOrder,
            boolean visible,
            boolean openInNewTab
    ) {
        this.id = id;
        this.profileId = profileId;
        this.type = type;
        this.label = label.trim();
        this.url = url.trim();
        this.icon = blankToNull(icon);
        this.displayOrder = displayOrder;
        this.visible = visible;
        this.openInNewTab = openInNewTab;
    }

    public UUID id() {
        return id;
    }

    public ProfessionalLinkType type() {
        return type;
    }

    public String label() {
        return label;
    }

    public String url() {
        return url;
    }

    public String icon() {
        return icon;
    }

    public int displayOrder() {
        return displayOrder;
    }

    public boolean visible() {
        return visible;
    }

    public boolean openInNewTab() {
        return openInNewTab;
    }

    private String blankToNull(String value) {
        return value == null || value.trim().isBlank() ? null : value.trim();
    }
}
