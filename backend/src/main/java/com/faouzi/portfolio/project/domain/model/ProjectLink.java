package com.faouzi.portfolio.project.domain.model;

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
@Table(name = "project_link")
public class ProjectLink {

    @Id
    private UUID id;

    @Column(name = "project_id", nullable = false)
    private UUID projectId;

    @Column(nullable = false, length = 120)
    private String label;

    @Column(nullable = false, length = 500)
    private String url;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    public ProjectLink(UUID id, UUID projectId, String label, String url, int displayOrder) {
        this.id = id;
        this.projectId = projectId;
        this.label = label;
        this.url = url;
        this.displayOrder = displayOrder;
    }
}
