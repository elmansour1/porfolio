package com.faouzi.portfolio.career.api;

import com.faouzi.portfolio.career.api.dto.response.PublicCareerResponse;
import com.faouzi.portfolio.career.application.service.CareerTimelineService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/career")
@RequiredArgsConstructor
public class PublicCareerController {

    private final CareerTimelineService service;

    @GetMapping
    public PublicCareerResponse career(@RequestParam(defaultValue = "fr") String lang) {
        return service.publicCareer(lang);
    }
}
