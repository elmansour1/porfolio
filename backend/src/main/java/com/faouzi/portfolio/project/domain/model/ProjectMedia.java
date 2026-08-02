package com.faouzi.portfolio.project.domain.model;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "project_media")
public class ProjectMedia {

    @Id
    private UUID id;

    @Column(name = "project_id", nullable = false)
    private UUID projectId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProjectMediaKind kind;

    @Column(name = "stored_filename", nullable = false, unique = true)
    private String storedFilename;

    @Column(name = "original_filename", nullable = false)
    private String originalFilename;

    @Column(name = "content_type", nullable = false, length = 120)
    private String contentType;

    @Column(name = "size_bytes", nullable = false)
    private long sizeBytes;

    @Column(name = "alt_text")
    private String altText;

    @Column
    private String caption;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    public ProjectMedia(
            UUID id,
            UUID projectId,
            ProjectMediaKind kind,
            String storedFilename,
            String originalFilename,
            String contentType,
            long sizeBytes,
            String altText,
            String caption,
            int displayOrder,
            Instant createdAt
    ) {
        this.id = id;
        this.projectId = projectId;
        this.kind = kind;
        this.storedFilename = storedFilename;
        this.originalFilename = originalFilename;
        this.contentType = contentType;
        this.sizeBytes = sizeBytes;
        this.altText = Project.blankToNull(altText);
        this.caption = Project.blankToNull(caption);
        this.displayOrder = displayOrder;
        this.createdAt = createdAt;
    }

    public void reorder(int displayOrder) {
        this.displayOrder = displayOrder;
    }
}
