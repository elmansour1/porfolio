package com.faouzi.portfolio.career.api;

import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.career.api.dto.request.CareerCertificationRequest;
import com.faouzi.portfolio.career.api.dto.response.CareerCertificationResponse;
import com.faouzi.portfolio.career.application.service.CareerTimelineService;
import com.faouzi.portfolio.profile.domain.model.PublicationStatus;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
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
@RequestMapping("/api/v1/admin/certifications")
@RequiredArgsConstructor
public class AdminCareerCertificationController {

    private final CareerTimelineService service;

    @GetMapping
    public List<CareerCertificationResponse> list(@RequestParam(required = false) PublicationStatus status) {
        return service.adminCertifications(status);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CareerCertificationResponse create(@Valid @RequestBody CareerCertificationRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        return service.createCertification(request, authentication, httpRequest);
    }

    @PutMapping("/{id}")
    public CareerCertificationResponse update(@PathVariable UUID id, @Valid @RequestBody CareerCertificationRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        return service.updateCertification(id, request, authentication, httpRequest);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id, Authentication authentication, HttpServletRequest request) {
        service.deleteCertification(id, authentication, request);
    }
}
