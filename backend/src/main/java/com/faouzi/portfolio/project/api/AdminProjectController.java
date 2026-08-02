package com.faouzi.portfolio.project.api;

import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.profile.domain.model.PublicationStatus;
import com.faouzi.portfolio.project.api.dto.request.ProjectRequest;
import com.faouzi.portfolio.project.api.dto.response.ProjectMetadataResponse;
import com.faouzi.portfolio.project.api.dto.response.ProjectResponse;
import com.faouzi.portfolio.project.application.service.ProjectService;
import com.faouzi.portfolio.project.domain.model.ProjectMediaKind;
import com.faouzi.portfolio.shared.api.dto.response.PageResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/admin/projects")
@RequiredArgsConstructor
public class AdminProjectController {

    private final ProjectService service;

    @GetMapping
    public PageResponse<ProjectResponse> list(
            @RequestParam(required = false) PublicationStatus status,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size
    ) {
        return service.adminList(status, page, size);
    }

    @GetMapping("/metadata")
    public ProjectMetadataResponse metadata() {
        return service.metadata();
    }

    @GetMapping("/{id}")
    public ProjectResponse detail(@PathVariable UUID id) {
        return service.adminDetail(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse create(@Valid @RequestBody ProjectRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        return service.create(request, authentication, httpRequest);
    }

    @PutMapping("/{id}")
    public ProjectResponse update(@PathVariable UUID id, @Valid @RequestBody ProjectRequest request, Authentication authentication, HttpServletRequest httpRequest) {
        return service.update(id, request, authentication, httpRequest);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id, Authentication authentication, HttpServletRequest httpRequest) {
        service.delete(id, authentication, httpRequest);
    }

    @PostMapping("/{id}/publish")
    public ProjectResponse publish(@PathVariable UUID id, Authentication authentication, HttpServletRequest httpRequest) {
        return service.publish(id, authentication, httpRequest);
    }

    @PostMapping("/{id}/unpublish")
    public ProjectResponse unpublish(@PathVariable UUID id, Authentication authentication, HttpServletRequest httpRequest) {
        return service.unpublish(id, authentication, httpRequest);
    }

    @PostMapping("/{id}/archive")
    public ProjectResponse archive(@PathVariable UUID id, Authentication authentication, HttpServletRequest httpRequest) {
        return service.archive(id, authentication, httpRequest);
    }

    @PutMapping("/{id}/featured")
    public ProjectResponse setFeatured(@PathVariable UUID id, @RequestParam boolean value, Authentication authentication, HttpServletRequest httpRequest) {
        return service.setFeatured(id, value, authentication, httpRequest);
    }

    @PutMapping("/{id}/order")
    public ProjectResponse reorder(@PathVariable UUID id, @RequestParam int displayOrder, Authentication authentication, HttpServletRequest httpRequest) {
        return service.reorder(id, displayOrder, authentication, httpRequest);
    }

    @PostMapping(path = "/{id}/media", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProjectResponse uploadMedia(
            @PathVariable UUID id,
            @RequestPart("file") MultipartFile file,
            @RequestParam ProjectMediaKind kind,
            @RequestParam(required = false) String altText,
            @RequestParam(required = false) String caption,
            Authentication authentication,
            HttpServletRequest httpRequest
    ) {
        return service.uploadMedia(id, file, kind, altText, caption, authentication, httpRequest);
    }

    @DeleteMapping("/{id}/media/{mediaId}")
    public ProjectResponse deleteMedia(@PathVariable UUID id, @PathVariable UUID mediaId, Authentication authentication, HttpServletRequest httpRequest) {
        return service.deleteMedia(id, mediaId, authentication, httpRequest);
    }

    @PutMapping("/{id}/media/order")
    public ProjectResponse reorderGalleryMedia(@PathVariable UUID id, @RequestBody List<UUID> orderedMediaIds, Authentication authentication, HttpServletRequest httpRequest) {
        return service.reorderGalleryMedia(id, orderedMediaIds, authentication, httpRequest);
    }

    @GetMapping("/media/{mediaId}")
    public ResponseEntity<Resource> readMedia(@PathVariable UUID mediaId) {
        var media = service.readAdminMedia(mediaId);
        ContentDisposition disposition = ContentDisposition.inline().filename(media.originalFilename()).build();
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(media.contentType()))
                .contentLength(media.sizeBytes())
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .body(media.resource());
    }
}
