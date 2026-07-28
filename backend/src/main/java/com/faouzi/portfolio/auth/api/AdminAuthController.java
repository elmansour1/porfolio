package com.faouzi.portfolio.auth.api;

import java.security.Principal;

import com.faouzi.portfolio.auth.api.dto.response.AuthSessionResponse;
import com.faouzi.portfolio.auth.api.dto.response.CsrfTokenResponse;
import com.faouzi.portfolio.auth.api.dto.request.ForgotPasswordRequest;
import com.faouzi.portfolio.auth.api.dto.response.ForgotPasswordResponse;
import com.faouzi.portfolio.auth.api.dto.request.LoginRequest;
import com.faouzi.portfolio.auth.api.dto.request.ResetPasswordRequest;
import com.faouzi.portfolio.auth.application.service.AdminAuthService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminAuthService authService;

    @GetMapping("/csrf")
    public CsrfTokenResponse csrf(
            CsrfToken csrfToken,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        Cookie cookie = new Cookie("XSRF-TOKEN", csrfToken.getToken());
        cookie.setPath("/");
        cookie.setHttpOnly(false);
        cookie.setSecure(request.isSecure());
        response.addCookie(cookie);
        return new CsrfTokenResponse("X-XSRF-TOKEN", csrfToken.getParameterName(), csrfToken.getToken());
    }

    @PostMapping("/login")
    public AuthSessionResponse login(@Valid @RequestBody LoginRequest request, HttpServletRequest servletRequest) {
        return AuthSessionResponse.from(authService.login(request.email(), request.password(), servletRequest));
    }

    @PostMapping("/logout")
    public void logout(Principal principal, HttpServletRequest request) {
        authService.logout(principal.getName(), request);
    }

    @GetMapping("/me")
    public AuthSessionResponse me(Principal principal) {
        return AuthSessionResponse.from(authService.currentAdmin(principal.getName()));
    }

    @PostMapping("/forgot-password")
    public ForgotPasswordResponse forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request,
            HttpServletRequest servletRequest
    ) {
        return ForgotPasswordResponse.from(authService.requestPasswordReset(request.email(), servletRequest));
    }

    @PostMapping("/reset-password")
    public void resetPassword(@Valid @RequestBody ResetPasswordRequest request, HttpServletRequest servletRequest) {
        authService.resetPassword(request.token(), request.newPassword(), servletRequest);
    }
}
