package com.faouzi.portfolio.profile.config;

import java.nio.file.Path;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.unit.DataSize;

@ConfigurationProperties(prefix = "app.profile.media")
public record ProfileMediaProperties(
        Path storagePath,
        DataSize maxImageSize,
        DataSize maxPdfSize
) {

    public ProfileMediaProperties {
        if (storagePath == null) {
            storagePath = Path.of("media");
        }
        if (maxImageSize == null) {
            maxImageSize = DataSize.ofMegabytes(3);
        }
        if (maxPdfSize == null) {
            maxPdfSize = DataSize.ofMegabytes(5);
        }
    }
}
