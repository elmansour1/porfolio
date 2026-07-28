package com.faouzi.portfolio.skills.api;

import com.faouzi.portfolio.skills.api.dto.response.PublicSkillsResponse;
import com.faouzi.portfolio.skills.application.service.SkillCatalogService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/skills")
@RequiredArgsConstructor
public class PublicSkillsController {

    private final SkillCatalogService service;

    @GetMapping
    public PublicSkillsResponse publicSkills(@RequestParam(defaultValue = "fr") String lang) {
        return service.publicSkills(lang);
    }
}
