package com.faouzi.portfolio.project.config;

import java.nio.file.Path;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.unit.DataSize;

@ConfigurationProperties(prefix = "app.project.media")
public record ProjectMediaProperties(
        Path storagePath,
        DataSize maxImageSize,
        int maxGalleryItems
) {

    public ProjectMediaProperties {
        if (storagePath == null) {
            storagePath = Path.of("media/projects");
        }
        if (maxImageSize == null) {
            maxImageSize = DataSize.ofMegabytes(4);
        }
        if (maxGalleryItems <= 0) {
            maxGalleryItems = 12;
        }
    }
}
