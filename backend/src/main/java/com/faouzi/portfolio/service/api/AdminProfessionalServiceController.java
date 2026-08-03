package com.faouzi.portfolio.service.api;

import java.util.UUID;

import com.faouzi.portfolio.profile.domain.model.PublicationStatus;
import com.faouzi.portfolio.service.api.dto.request.ArchiveServiceRequest;
import com.faouzi.portfolio.service.api.dto.request.CreateServiceRequest;
import com.faouzi.portfolio.service.api.dto.request.PublishServiceRequest;
import com.faouzi.portfolio.service.api.dto.request.ReorderServicesRequest;
import com.faouzi.portfolio.service.api.dto.request.UpdateServiceRequest;
import com.faouzi.portfolio.service.api.dto.response.ServiceAdminDetailResponse;
import com.faouzi.portfolio.service.api.dto.response.ServiceAdminSummaryResponse;
import com.faouzi.portfolio.service.api.dto.response.ServiceMetadataResponse;
import com.faouzi.portfolio.service.application.service.ProfessionalServiceApplicationService;
import com.faouzi.portfolio.shared.api.dto.response.PageResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/services")
@RequiredArgsConstructor
public class AdminProfessionalServiceController {

    private final ProfessionalServiceApplicationService service;

    @GetMapping
    public PageResponse<ServiceAdminSummaryResponse> list(
            @RequestParam(required = false) PublicationStatus status,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size
    ) {
        return service.adminList(status, featured, page, size);
    }

    @GetMapping("/metadata")
    public ServiceMetadataResponse metadata() {
        return service.metadata();
    }

    @GetMapping("/{id}")
    public ServiceAdminDetailResponse detail(@PathVariable UUID id) {
        return service.adminDetail(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ServiceAdminDetailResponse create(@Valid @RequestBody CreateServiceRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        return service.create(request, authentication, httpRequest);
    }

    @PutMapping("/{id}")
    public ServiceAdminDetailResponse update(@PathVariable UUID id, @Valid @RequestBody UpdateServiceRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        return service.update(id, request, authentication, httpRequest);
    }

    @PostMapping("/{id}/publish")
    public ServiceAdminDetailResponse publish(@PathVariable UUID id, @RequestBody(required = false) PublishServiceRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        return service.publish(id, authentication, httpRequest);
    }

    @PostMapping("/{id}/unpublish")
    public ServiceAdminDetailResponse unpublish(@PathVariable UUID id, Authentication authentication, HttpServletRequest httpRequest) {
        return service.unpublish(id, authentication, httpRequest);
    }

    @PostMapping("/{id}/archive")
    public ServiceAdminDetailResponse archive(@PathVariable UUID id, @RequestBody(required = false) ArchiveServiceRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        return service.archive(id, authentication, httpRequest);
    }

    @PutMapping("/{id}/featured")
    public ServiceAdminDetailResponse setFeatured(@PathVariable UUID id, @RequestParam boolean value, Authentication authentication, HttpServletRequest httpRequest) {
        return service.setFeatured(id, value, authentication, httpRequest);
    }

    @PutMapping("/order")
    public java.util.List<ServiceAdminSummaryResponse> reorder(@Valid @RequestBody ReorderServicesRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        return service.reorderServices(request.orderedIds(), authentication, httpRequest);
    }
}
