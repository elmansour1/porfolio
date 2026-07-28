package com.faouzi.portfolio.profile.api;

import com.faouzi.portfolio.profile.api.dto.response.PublicPortfolioResponse;
import com.faouzi.portfolio.profile.application.service.PortfolioProfileService;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
public class PublicPortfolioController {

    private final PortfolioProfileService service;

    @GetMapping("/portfolio")
    public PublicPortfolioResponse portfolio(@RequestParam(name = "lang", defaultValue = "fr") String language) {
        return service.publicPortfolio(language);
    }

    @GetMapping("/profile/photo")
    public ResponseEntity<Resource> profilePhoto() {
        return AdminProfileController.mediaResponse(service.readPublicProfilePhoto(), false);
    }

    @GetMapping("/profile/cv")
    public ResponseEntity<Resource> profileCv() {
        return AdminProfileController.mediaResponse(service.readPublicCv(), true);
    }

    @GetMapping("/settings/logo")
    public ResponseEntity<Resource> logo() {
        return AdminProfileController.mediaResponse(service.readPublicLogo(), false);
    }

    @GetMapping("/settings/favicon")
    public ResponseEntity<Resource> favicon() {
        return AdminProfileController.mediaResponse(service.readPublicFavicon(), false);
    }
}
