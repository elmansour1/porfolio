package com.faouzi.portfolio.service.api.dto.request;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record ReorderWorkProcessStepsRequest(@NotNull List<UUID> orderedIds) {
}
