package com.faouzi.portfolio.contact.api.dto.request;

import com.faouzi.portfolio.contact.domain.model.ContactMessageStatus;

import jakarta.validation.constraints.NotNull;

public record ContactMessageStatusUpdateRequest(
        @NotNull ContactMessageStatus status
) {
}
