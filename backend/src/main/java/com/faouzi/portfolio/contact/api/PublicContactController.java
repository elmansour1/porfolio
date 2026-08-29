package com.faouzi.portfolio.contact.api;

import com.faouzi.portfolio.contact.api.dto.request.ContactRequest;
import com.faouzi.portfolio.contact.api.dto.response.ContactCsrfTokenResponse;
import com.faouzi.portfolio.contact.application.service.ContactApplicationService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/contact")
@RequiredArgsConstructor
public class PublicContactController {

    private final ContactApplicationService contactService;

    @GetMapping("/csrf")
    public ContactCsrfTokenResponse csrf(
            CsrfToken csrfToken,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        Cookie cookie = new Cookie("XSRF-TOKEN", csrfToken.getToken());
        cookie.setPath("/");
        cookie.setHttpOnly(false);
        cookie.setSecure(request.isSecure());
        response.addCookie(cookie);
        return new ContactCsrfTokenResponse("X-XSRF-TOKEN", csrfToken.getParameterName(), csrfToken.getToken());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void submit(@Valid @RequestBody ContactRequest request, HttpServletRequest httpRequest) {
        contactService.submit(request, httpRequest);
    }
}
