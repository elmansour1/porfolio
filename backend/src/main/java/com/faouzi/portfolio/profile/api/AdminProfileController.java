package com.faouzi.portfolio.profile.api;

import com.faouzi.portfolio.profile.application.PortfolioProfileService;
import com.faouzi.portfolio.profile.application.ProfileMediaFile;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/admin/profile")
public class AdminProfileController {

    private final PortfolioProfileService service;

    public AdminProfileController(PortfolioProfileService service) {
        this.service = service;
    }

    @GetMapping
    public AdminProfileResponse getProfile() {
        return service.adminProfile();
    }

    @PutMapping
    public AdminProfileResponse updateProfile(
            @Valid @RequestBody AdminProfileRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest
    ) {
        return service.updateProfile(request, authentication, httpRequest);
    }

    @PostMapping(path = "/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public AdminProfileResponse uploadPhoto(
            @RequestPart("file") MultipartFile file,
            @RequestParam(name = "altText", required = false) String altText,
            Authentication authentication,
            HttpServletRequest request
    ) {
        return service.uploadProfilePhoto(file, altText, authentication, request);
    }

    @GetMapping("/photo")
    public ResponseEntity<Resource> readPhoto() {
        return mediaResponse(service.readAdminProfilePhoto(), false);
    }

    @DeleteMapping("/photo")
    public AdminProfileResponse deletePhoto(Authentication authentication, HttpServletRequest request) {
        return service.deleteProfilePhoto(authentication, request);
    }

    @PostMapping(path = "/cv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public AdminProfileResponse uploadCv(
            @RequestPart("file") MultipartFile file,
            Authentication authentication,
            HttpServletRequest request
    ) {
        return service.uploadCv(file, authentication, request);
    }

    @GetMapping("/cv")
    public ResponseEntity<Resource> readCv() {
        return mediaResponse(service.readAdminCv(), true);
    }

    @DeleteMapping("/cv")
    public AdminProfileResponse deleteCv(Authentication authentication, HttpServletRequest request) {
        return service.deleteCv(authentication, request);
    }

    static ResponseEntity<Resource> mediaResponse(ProfileMediaFile media, boolean attachment) {
        ContentDisposition disposition = attachment
                ? ContentDisposition.attachment().filename(media.originalFilename()).build()
                : ContentDisposition.inline().filename(media.originalFilename()).build();
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(media.contentType()))
                .contentLength(media.sizeBytes())
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .body(media.resource());
    }
}
