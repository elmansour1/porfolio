package com.faouzi.portfolio.contact.config;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.contact")
public record ContactProperties(
        String honeypotField,
        int messageMaxLength,
        RateLimit rateLimit
) {

    public ContactProperties {
        if (honeypotField == null || honeypotField.isBlank()) {
            honeypotField = "website";
        }
        if (messageMaxLength <= 0) {
            messageMaxLength = 5000;
        }
        if (rateLimit == null) {
            rateLimit = new RateLimit(5, Duration.ofMinutes(15));
        }
    }

    public record RateLimit(int maxSubmissions, Duration window) {

        public RateLimit {
            if (maxSubmissions <= 0) {
                maxSubmissions = 5;
            }
            if (window == null) {
                window = Duration.ofMinutes(15);
            }
        }
    }
}
