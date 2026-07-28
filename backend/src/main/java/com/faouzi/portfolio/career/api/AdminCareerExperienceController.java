package com.faouzi.portfolio.career.api;

import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.career.api.dto.request.CareerExperienceRequest;
import com.faouzi.portfolio.career.api.dto.response.CareerExperienceResponse;
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
@RequestMapping("/api/v1/admin/experiences")
@RequiredArgsConstructor
public class AdminCareerExperienceController {

    private final CareerTimelineService service;

    @GetMapping
    public List<CareerExperienceResponse> list(@RequestParam(required = false) PublicationStatus status) {
        return service.adminExperiences(status);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CareerExperienceResponse create(@Valid @RequestBody CareerExperienceRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        return service.createExperience(request, authentication, httpRequest);
    }

    @PutMapping("/{id}")
    public CareerExperienceResponse update(@PathVariable UUID id, @Valid @RequestBody CareerExperienceRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        return service.updateExperience(id, request, authentication, httpRequest);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id, Authentication authentication, HttpServletRequest request) {
        service.deleteExperience(id, authentication, request);
    }
}
