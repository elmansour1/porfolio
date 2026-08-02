package com.faouzi.portfolio.project.infrastructure.storage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Clock;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import com.faouzi.portfolio.project.application.dto.ProjectMediaFile;
import com.faouzi.portfolio.project.config.ProjectMediaProperties;
import com.faouzi.portfolio.project.domain.model.ProjectMedia;
import com.faouzi.portfolio.project.domain.model.ProjectMediaKind;
import com.faouzi.portfolio.project.infrastructure.persistence.ProjectMediaRepository;
import com.faouzi.portfolio.shared.error.ApiException;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ProjectMediaStorageService {

    private static final Set<String> IMAGE_CONTENT_TYPES = Set.of("image/jpeg", "image/png", "image/webp", "image/avif");
    private static final Map<String, String> EXTENSIONS = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp",
            "image/avif", ".avif"
    );

    private final ProjectMediaProperties properties;
    private final ProjectMediaRepository mediaRepository;
    private final Clock clock;

    public ProjectMedia store(
            UUID projectId,
            MultipartFile file,
            ProjectMediaKind kind,
            String altText,
            String caption,
            int displayOrder
    ) {
        validate(file);
        UUID id = UUID.randomUUID();
        String contentType = normalizeContentType(file.getContentType());
        String storedFilename = "project-" + projectId + "-" + kind.name().toLowerCase(Locale.ROOT) + "-" + id + EXTENSIONS.get(contentType);
        Path target = storageRoot().resolve(storedFilename).normalize();

        try {
            Files.createDirectories(storageRoot());
            file.transferTo(target);
        } catch (IOException exception) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "MEDIA_STORAGE_ERROR",
                    "The file could not be stored.");
        }

        return mediaRepository.save(new ProjectMedia(
                id,
                projectId,
                kind,
                storedFilename,
                safeOriginalFilename(file),
                contentType,
                file.getSize(),
                altText,
                caption,
                displayOrder,
                clock.instant()
        ));
    }

    public ProjectMediaFile read(ProjectMedia media) {
        Path path = storageRoot().resolve(media.getStoredFilename()).normalize();
        if (!path.startsWith(storageRoot()) || !Files.exists(path)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "MEDIA_NOT_FOUND", "The requested media file was not found.");
        }
        return new ProjectMediaFile(new FileSystemResource(path), media.getContentType(), media.getOriginalFilename(), media.getSizeBytes());
    }

    public void delete(ProjectMedia media) {
        Path path = storageRoot().resolve(media.getStoredFilename()).normalize();
        if (path.startsWith(storageRoot())) {
            try {
                Files.deleteIfExists(path);
            } catch (IOException ignored) {
                // Metadata deletion is still allowed; orphan cleanup can be handled by operations.
            }
        }
        mediaRepository.delete(media);
    }

    private void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "MEDIA_EMPTY", "A non-empty file is required.");
        }
        String contentType = normalizeContentType(file.getContentType());
        if (!IMAGE_CONTENT_TYPES.contains(contentType)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "MEDIA_TYPE_NOT_ALLOWED", "This file type is not allowed.");
        }
        if (file.getSize() > properties.maxImageSize().toBytes()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "MEDIA_TOO_LARGE", "The uploaded file is too large.");
        }
        String original = safeOriginalFilename(file).toLowerCase(Locale.ROOT);
        if (!hasAllowedExtension(original, contentType)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "MEDIA_EXTENSION_NOT_ALLOWED",
                    "The file extension does not match an allowed type.");
        }
    }

    private boolean hasAllowedExtension(String originalFilename, String contentType) {
        if ("image/jpeg".equals(contentType)) {
            return originalFilename.endsWith(".jpg") || originalFilename.endsWith(".jpeg");
        }
        String expectedExtension = EXTENSIONS.get(contentType);
        return expectedExtension != null && originalFilename.endsWith(expectedExtension);
    }

    private Path storageRoot() {
        return properties.storagePath().toAbsolutePath().normalize();
    }

    private String safeOriginalFilename(MultipartFile file) {
        String original = StringUtils.cleanPath(file.getOriginalFilename() == null ? "file" : file.getOriginalFilename());
        if (original.contains("..") || original.contains("/") || original.contains("\\")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "MEDIA_FILENAME_INVALID", "The file name is invalid.");
        }
        return original;
    }

    private String normalizeContentType(String contentType) {
        return contentType == null ? "" : contentType.trim().toLowerCase(Locale.ROOT);
    }
}
