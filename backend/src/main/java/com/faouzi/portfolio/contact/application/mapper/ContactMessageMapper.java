package com.faouzi.portfolio.contact.application.mapper;

import java.util.List;

import com.faouzi.portfolio.contact.api.dto.response.ContactMessageAdminDetailResponse;
import com.faouzi.portfolio.contact.api.dto.response.ContactMessageAdminSummaryResponse;
import com.faouzi.portfolio.contact.api.dto.response.ContactMetadataResponse;
import com.faouzi.portfolio.contact.api.dto.response.OptionResponse;
import com.faouzi.portfolio.contact.domain.model.ContactMessage;
import com.faouzi.portfolio.contact.domain.model.ContactMessageStatus;
import com.faouzi.portfolio.contact.domain.model.ContactRequestType;

import org.springframework.stereotype.Component;

@Component
public class ContactMessageMapper {

    public ContactMessageAdminSummaryResponse toAdminSummary(ContactMessage message) {
        return new ContactMessageAdminSummaryResponse(
                message.getId(),
                message.getName(),
                message.getEmail(),
                message.getCompany(),
                message.getRequestType(),
                message.getSubject(),
                message.getStatus(),
                message.getCreatedAt()
        );
    }

    public ContactMessageAdminDetailResponse toAdminDetail(ContactMessage message) {
        return new ContactMessageAdminDetailResponse(
                message.getId(),
                message.getName(),
                message.getEmail(),
                message.getCompany(),
                message.getRequestType(),
                message.getSubject(),
                message.getMessage(),
                message.isConsent(),
                message.getStatus(),
                message.getIpAddress(),
                message.getUserAgent(),
                message.getCreatedAt(),
                message.getUpdatedAt()
        );
    }

    public ContactMetadataResponse metadata() {
        return new ContactMetadataResponse(
                List.of(ContactMessageStatus.values()).stream()
                        .map(status -> new OptionResponse(status.name(), status.name()))
                        .toList(),
                List.of(ContactRequestType.values()).stream()
                        .map(type -> new OptionResponse(type.name(), type.name()))
                        .toList()
        );
    }
}
