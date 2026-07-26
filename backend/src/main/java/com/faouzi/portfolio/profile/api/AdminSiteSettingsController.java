package com.faouzi.portfolio.profile.api;

import com.faouzi.portfolio.profile.application.PortfolioProfileService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/admin/settings")
public class AdminSiteSettingsController {

    private final PortfolioProfileService service;

    public AdminSiteSettingsController(PortfolioProfileService service) {
        this.service = service;
    }

    @GetMapping
    public AdminSiteSettingsResponse getSettings() {
        return service.adminSettings();
    }

    @PutMapping
    public AdminSiteSettingsResponse updateSettings(
            @Valid @RequestBody AdminSiteSettingsRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest
    ) {
        return service.updateSettings(request, authentication, httpRequest);
    }

    @PostMapping(path = "/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public AdminSiteSettingsResponse uploadLogo(
            @RequestPart("file") MultipartFile file,
            @RequestParam(name = "altText", required = false) String altText,
            Authentication authentication,
            HttpServletRequest request
    ) {
        return service.uploadLogo(file, altText, authentication, request);
    }

    @GetMapping("/logo")
    public ResponseEntity<Resource> readLogo() {
        return AdminProfileController.mediaResponse(service.readAdminLogo(), false);
    }

    @DeleteMapping("/logo")
    public AdminSiteSettingsResponse deleteLogo(Authentication authentication, HttpServletRequest request) {
        return service.deleteLogo(authentication, request);
    }

    @PostMapping(path = "/favicon", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public AdminSiteSettingsResponse uploadFavicon(
            @RequestPart("file") MultipartFile file,
            Authentication authentication,
            HttpServletRequest request
    ) {
        return service.uploadFavicon(file, authentication, request);
    }

    @GetMapping("/favicon")
    public ResponseEntity<Resource> readFavicon() {
        return AdminProfileController.mediaResponse(service.readAdminFavicon(), false);
    }

    @DeleteMapping("/favicon")
    public AdminSiteSettingsResponse deleteFavicon(Authentication authentication, HttpServletRequest request) {
        return service.deleteFavicon(authentication, request);
    }
}
