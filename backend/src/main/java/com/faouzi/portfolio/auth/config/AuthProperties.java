package com.faouzi.portfolio.auth.config;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.auth")
public record AuthProperties(
        Bootstrap bootstrap,
        Login login,
        Reset reset
) {

    public AuthProperties {
        if (bootstrap == null) {
            bootstrap = new Bootstrap(null, null);
        }
        if (login == null) {
            login = new Login(5, Duration.ofMinutes(15));
        }
        if (reset == null) {
            reset = new Reset(Duration.ofMinutes(30), false);
        }
    }

    public record Bootstrap(String email, String password) {
    }

    public record Login(int maxFailures, Duration lockDuration) {
    }

    public record Reset(Duration tokenTtl, boolean exposeToken) {
    }
}
