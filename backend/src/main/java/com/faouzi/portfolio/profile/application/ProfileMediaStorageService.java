package com.faouzi.portfolio.profile.application;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Clock;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import com.faouzi.portfolio.profile.config.ProfileMediaProperties;
import com.faouzi.portfolio.profile.domain.ProfileMedia;
import com.faouzi.portfolio.profile.domain.ProfileMediaKind;
import com.faouzi.portfolio.profile.domain.ProfileMediaRepository;
import com.faouzi.portfolio.shared.error.ApiException;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProfileMediaStorageService {

    private static final Set<String> IMAGE_CONTENT_TYPES = Set.of("image/jpeg", "image/png", "image/webp", "image/avif");
    private static final Map<String, String> EXTENSIONS = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp",
            "image/avif", ".avif",
            "application/pdf", ".pdf"
    );

    private final ProfileMediaProperties properties;
    private final ProfileMediaRepository mediaRepository;
    private final Clock clock;

    public ProfileMediaStorageService(
            ProfileMediaProperties properties,
            ProfileMediaRepository mediaRepository,
            Clock clock
    ) {
        this.properties = properties;
        this.mediaRepository = mediaRepository;
        this.clock = clock;
    }

    public ProfileMedia store(MultipartFile file, ProfileMediaKind kind, String altText) {
        validate(file, kind);
        UUID id = UUID.randomUUID();
        String contentType = normalizeContentType(file.getContentType());
        String storedFilename = kind.name().toLowerCase(Locale.ROOT) + "-" + id + EXTENSIONS.get(contentType);
        Path target = storageRoot().resolve(storedFilename).normalize();

        try {
            Files.createDirectories(storageRoot());
            file.transferTo(target);
        } catch (IOException exception) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "MEDIA_STORAGE_ERROR",
                    "The file could not be stored.");
        }

        return mediaRepository.save(new ProfileMedia(
                id,
                kind,
                safeOriginalFilename(file),
                storedFilename,
                contentType,
                file.getSize(),
                blankToNull(altText),
                clock.instant()
        ));
    }

    public ProfileMediaFile read(ProfileMedia media) {
        Path path = storageRoot().resolve(media.storedFilename()).normalize();
        if (!path.startsWith(storageRoot()) || !Files.exists(path)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "MEDIA_NOT_FOUND", "The requested media file was not found.");
        }
        return new ProfileMediaFile(new FileSystemResource(path), media.contentType(), media.originalFilename(), media.sizeBytes());
    }

    public void delete(ProfileMedia media) {
        Path path = storageRoot().resolve(media.storedFilename()).normalize();
        if (path.startsWith(storageRoot())) {
            try {
                Files.deleteIfExists(path);
            } catch (IOException ignored) {
                // Metadata deletion is still allowed; orphan cleanup can be handled by operations.
            }
        }
        mediaRepository.delete(media);
    }

    private void validate(MultipartFile file, ProfileMediaKind kind) {
        if (file == null || file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "MEDIA_EMPTY", "A non-empty file is required.");
        }
        String contentType = normalizeContentType(file.getContentType());
        if (!allowedContentTypes(kind).contains(contentType)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "MEDIA_TYPE_NOT_ALLOWED", "This file type is not allowed.");
        }
        long maxSize = kind == ProfileMediaKind.CV_PDF
                ? properties.maxPdfSize().toBytes()
                : properties.maxImageSize().toBytes();
        if (file.getSize() > maxSize) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "MEDIA_TOO_LARGE", "The uploaded file is too large.");
        }
        String original = safeOriginalFilename(file).toLowerCase(Locale.ROOT);
        if (!hasAllowedExtension(original, contentType)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "MEDIA_EXTENSION_NOT_ALLOWED",
                    "The file extension does not match an allowed type.");
        }
    }

    private Set<String> allowedContentTypes(ProfileMediaKind kind) {
        if (kind == ProfileMediaKind.CV_PDF) {
            return Set.of("application/pdf");
        }
        return IMAGE_CONTENT_TYPES;
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

    private String blankToNull(String value) {
        return value == null || value.trim().isBlank() ? null : value.trim();
    }
}
