package com.faouzi.portfolio.contact.api.dto.response;

import java.time.Instant;
import java.util.UUID;

import com.faouzi.portfolio.contact.domain.model.ContactMessageStatus;
import com.faouzi.portfolio.contact.domain.model.ContactRequestType;

public record ContactMessageAdminSummaryResponse(
        UUID id,
        String name,
        String email,
        String company,
        ContactRequestType requestType,
        String subject,
        ContactMessageStatus status,
        Instant createdAt
) {
}
