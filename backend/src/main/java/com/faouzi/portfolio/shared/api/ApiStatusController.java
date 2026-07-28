package com.faouzi.portfolio.shared.api;

import java.time.Instant;

import com.faouzi.portfolio.shared.api.dto.response.ApiStatusResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/status")
public class ApiStatusController {

    @GetMapping
    public ResponseEntity<ApiStatusResponse> status() {
        return ResponseEntity.ok(new ApiStatusResponse("portfolio-api", "UP", Instant.now()));
    }
}
