package com.faouzi.portfolio.service.api;

import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.service.api.dto.request.CreateWorkProcessStepRequest;
import com.faouzi.portfolio.service.api.dto.request.PublishWorkProcessStepRequest;
import com.faouzi.portfolio.service.api.dto.request.ReorderWorkProcessStepsRequest;
import com.faouzi.portfolio.service.api.dto.request.UpdateWorkProcessStepRequest;
import com.faouzi.portfolio.service.api.dto.response.WorkProcessStepAdminResponse;
import com.faouzi.portfolio.service.application.service.ProfessionalServiceApplicationService;

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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/work-process-steps")
@RequiredArgsConstructor
public class AdminWorkProcessStepController {

    private final ProfessionalServiceApplicationService service;

    @GetMapping
    public List<WorkProcessStepAdminResponse> list() {
        return service.adminSteps();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WorkProcessStepAdminResponse create(@Valid @RequestBody CreateWorkProcessStepRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        return service.createStep(request, authentication, httpRequest);
    }

    @PutMapping("/{id}")
    public WorkProcessStepAdminResponse update(@PathVariable UUID id, @Valid @RequestBody UpdateWorkProcessStepRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        return service.updateStep(id, request, authentication, httpRequest);
    }

    @PostMapping("/{id}/publish")
    public WorkProcessStepAdminResponse publish(@PathVariable UUID id, @RequestBody(required = false) PublishWorkProcessStepRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        return service.publishStep(id, authentication, httpRequest);
    }

    @PostMapping("/{id}/unpublish")
    public WorkProcessStepAdminResponse unpublish(@PathVariable UUID id, Authentication authentication, HttpServletRequest httpRequest) {
        return service.unpublishStep(id, authentication, httpRequest);
    }

    @PostMapping("/{id}/archive")
    public WorkProcessStepAdminResponse archive(@PathVariable UUID id, Authentication authentication, HttpServletRequest httpRequest) {
        return service.archiveStep(id, authentication, httpRequest);
    }

    @PutMapping("/order")
    public List<WorkProcessStepAdminResponse> reorder(@Valid @RequestBody ReorderWorkProcessStepsRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        return service.reorderSteps(request.orderedIds(), authentication, httpRequest);
    }
}
