package com.faouzi.portfolio.contact.api;

import java.util.UUID;

import com.faouzi.portfolio.contact.api.dto.request.ContactMessageStatusUpdateRequest;
import com.faouzi.portfolio.contact.api.dto.response.ContactMessageAdminDetailResponse;
import com.faouzi.portfolio.contact.api.dto.response.ContactMessageAdminSummaryResponse;
import com.faouzi.portfolio.contact.api.dto.response.ContactMetadataResponse;
import com.faouzi.portfolio.contact.application.service.ContactApplicationService;
import com.faouzi.portfolio.contact.domain.model.ContactMessageStatus;
import com.faouzi.portfolio.shared.api.dto.response.PageResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/messages")
@RequiredArgsConstructor
public class AdminMessagesController {

    private final ContactApplicationService contactService;

    @GetMapping
    public PageResponse<ContactMessageAdminSummaryResponse> list(
            @RequestParam(required = false) ContactMessageStatus status,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size
    ) {
        return contactService.adminList(status, page, size);
    }

    @GetMapping("/metadata")
    public ContactMetadataResponse metadata() {
        return contactService.metadata();
    }

    @GetMapping("/{id}")
    public ContactMessageAdminDetailResponse detail(@PathVariable UUID id) {
        return contactService.adminDetail(id);
    }

    @PutMapping("/{id}/status")
    public ContactMessageAdminDetailResponse updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody ContactMessageStatusUpdateRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest
    ) {
        return contactService.updateStatus(id, request.status(), authentication, httpRequest);
    }
}
