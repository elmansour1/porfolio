package com.faouzi.portfolio.career.api;

import com.faouzi.portfolio.career.api.dto.response.CareerMetadataResponse;
import com.faouzi.portfolio.career.application.service.CareerTimelineService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/career")
@RequiredArgsConstructor
public class AdminCareerMetadataController {

    private final CareerTimelineService service;

    @GetMapping("/metadata")
    public CareerMetadataResponse metadata() {
        return service.metadata();
    }
}
