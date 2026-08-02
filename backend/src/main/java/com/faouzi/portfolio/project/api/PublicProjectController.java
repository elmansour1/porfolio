package com.faouzi.portfolio.project.api;

import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.project.api.dto.response.PublicProjectResponse;
import com.faouzi.portfolio.project.api.dto.response.PublicProjectSummaryResponse;
import com.faouzi.portfolio.project.application.service.ProjectService;
import com.faouzi.portfolio.shared.api.dto.response.PageResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/projects")
@RequiredArgsConstructor
public class PublicProjectController {

    private final ProjectService service;

    @GetMapping
    public PageResponse<PublicProjectSummaryResponse> list(
            @RequestParam(name = "lang", defaultValue = "fr") String language,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) UUID skillId
    ) {
        return service.publicList(language, page, size, skillId);
    }

    @GetMapping("/featured")
    public List<PublicProjectSummaryResponse> featured(@RequestParam(name = "lang", defaultValue = "fr") String language) {
        return service.publicFeatured(language);
    }

    @GetMapping("/{slug}")
    public PublicProjectResponse detail(@PathVariable String slug, @RequestParam(name = "lang", defaultValue = "fr") String language) {
        return service.publicDetail(slug, language);
    }

    @GetMapping("/media/{mediaId}")
    public ResponseEntity<Resource> media(@PathVariable UUID mediaId) {
        var media = service.readPublicMedia(mediaId);
        ContentDisposition disposition = ContentDisposition.inline().filename(media.originalFilename()).build();
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(media.contentType()))
                .contentLength(media.sizeBytes())
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .body(media.resource());
    }
}
