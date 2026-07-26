package com.faouzi.portfolio.shared.api;

import java.time.Instant;

public record ApiStatusResponse(String service, String status, Instant timestamp) {
}
