package com.faouzi.portfolio.contact.api.dto.response;

import java.time.Instant;
import java.util.UUID;

import com.faouzi.portfolio.contact.domain.model.ContactMessageStatus;
import com.faouzi.portfolio.contact.domain.model.ContactRequestType;

public record ContactMessageAdminDetailResponse(
        UUID id,
        String name,
        String email,
        String company,
        ContactRequestType requestType,
        String subject,
        String message,
        boolean consent,
        ContactMessageStatus status,
        String ipAddress,
        String userAgent,
        Instant createdAt,
        Instant updatedAt
) {
}
