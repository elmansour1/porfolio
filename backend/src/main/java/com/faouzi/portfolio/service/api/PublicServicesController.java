package com.faouzi.portfolio.service.api;

import java.util.List;

import com.faouzi.portfolio.service.api.dto.response.ServicePublicResponse;
import com.faouzi.portfolio.service.api.dto.response.WorkProcessStepPublicResponse;
import com.faouzi.portfolio.service.application.service.ProfessionalServiceApplicationService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/services")
@RequiredArgsConstructor
public class PublicServicesController {

    private final ProfessionalServiceApplicationService service;

    @GetMapping
    public List<ServicePublicResponse> list(@RequestParam(name = "lang", defaultValue = "fr") String language) {
        return service.publicServices(language);
    }

    @GetMapping("/featured")
    public List<ServicePublicResponse> featured(@RequestParam(name = "lang", defaultValue = "fr") String language) {
        return service.publicFeatured(language);
    }

    @GetMapping("/{slug}")
    public ServicePublicResponse detail(@PathVariable String slug, @RequestParam(name = "lang", defaultValue = "fr") String language) {
        return service.publicDetail(slug, language);
    }

    @GetMapping("/work-process/steps")
    public List<WorkProcessStepPublicResponse> workProcessSteps(@RequestParam(name = "lang", defaultValue = "fr") String language) {
        return service.publicSteps(language);
    }
}
