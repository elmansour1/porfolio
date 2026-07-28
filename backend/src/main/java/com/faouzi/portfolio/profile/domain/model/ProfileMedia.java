package com.faouzi.portfolio.profile.domain.model;

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
@Table(name = "profile_media")
public class ProfileMedia {

    @Id
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private ProfileMediaKind kind;

    @Column(name = "original_filename", nullable = false)
    private String originalFilename;

    @Column(name = "stored_filename", nullable = false, unique = true)
    private String storedFilename;

    @Column(name = "content_type", nullable = false, length = 120)
    private String contentType;

    @Column(name = "size_bytes", nullable = false)
    private long sizeBytes;

    @Column(name = "alt_text")
    private String altText;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    public ProfileMedia(
            UUID id,
            ProfileMediaKind kind,
            String originalFilename,
            String storedFilename,
            String contentType,
            long sizeBytes,
            String altText,
            Instant createdAt
    ) {
        this.id = id;
        this.kind = kind;
        this.originalFilename = originalFilename;
        this.storedFilename = storedFilename;
        this.contentType = contentType;
        this.sizeBytes = sizeBytes;
        this.altText = altText;
        this.createdAt = createdAt;
    }

}
