package com.faouzi.portfolio.skills.api;

import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.profile.domain.model.PublicationStatus;
import com.faouzi.portfolio.skills.api.dto.response.SkillMetadataResponse;
import com.faouzi.portfolio.skills.api.dto.request.SkillRequest;
import com.faouzi.portfolio.skills.api.dto.response.SkillResponse;
import com.faouzi.portfolio.skills.application.service.SkillCatalogService;

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
@RequestMapping("/api/v1/admin/skills")
@RequiredArgsConstructor
public class AdminSkillController {

    private final SkillCatalogService service;

    @GetMapping
    public List<SkillResponse> listSkills(
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) PublicationStatus status,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) String query
    ) {
        return service.adminSkills(categoryId, status, featured, query);
    }

    @GetMapping("/metadata")
    public SkillMetadataResponse metadata() {
        return service.metadata();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SkillResponse createSkill(
            @Valid @RequestBody SkillRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest
    ) {
        return service.createSkill(request, authentication, httpRequest);
    }

    @PutMapping("/{id}")
    public SkillResponse updateSkill(
            @PathVariable UUID id,
            @Valid @RequestBody SkillRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest
    ) {
        return service.updateSkill(id, request, authentication, httpRequest);
    }

    @PostMapping("/{id}/publish")
    public SkillResponse publishSkill(@PathVariable UUID id, Authentication authentication, HttpServletRequest request) {
        return service.publishSkill(id, authentication, request);
    }

    @PostMapping("/{id}/archive")
    public SkillResponse archiveSkill(@PathVariable UUID id, Authentication authentication, HttpServletRequest request) {
        return service.archiveSkill(id, authentication, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSkill(@PathVariable UUID id, Authentication authentication, HttpServletRequest request) {
        service.deleteSkill(id, authentication, request);
    }
}
