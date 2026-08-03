package com.faouzi.portfolio.service.api.dto.request;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record ReorderServicesRequest(@NotNull List<UUID> orderedIds) {
}
