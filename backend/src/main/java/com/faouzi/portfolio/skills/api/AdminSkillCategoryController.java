package com.faouzi.portfolio.skills.api;

import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.skills.api.dto.request.SkillCategoryRequest;
import com.faouzi.portfolio.skills.api.dto.response.SkillCategoryResponse;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/skill-categories")
@RequiredArgsConstructor
public class AdminSkillCategoryController {

    private final SkillCatalogService service;

    @GetMapping
    public List<SkillCategoryResponse> listCategories() {
        return service.adminCategories();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SkillCategoryResponse createCategory(
            @Valid @RequestBody SkillCategoryRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest
    ) {
        return service.createCategory(request, authentication, httpRequest);
    }

    @PutMapping("/{id}")
    public SkillCategoryResponse updateCategory(
            @PathVariable UUID id,
            @Valid @RequestBody SkillCategoryRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest
    ) {
        return service.updateCategory(id, request, authentication, httpRequest);
    }

    @PostMapping("/{id}/publish")
    public SkillCategoryResponse publishCategory(@PathVariable UUID id, Authentication authentication, HttpServletRequest request) {
        return service.publishCategory(id, authentication, request);
    }

    @PostMapping("/{id}/archive")
    public SkillCategoryResponse archiveCategory(@PathVariable UUID id, Authentication authentication, HttpServletRequest request) {
        return service.archiveCategory(id, authentication, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable UUID id, Authentication authentication, HttpServletRequest request) {
        service.deleteCategory(id, authentication, request);
    }
}
