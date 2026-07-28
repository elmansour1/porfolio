package com.faouzi.portfolio.auth;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Clock;
import java.time.Instant;
import java.util.UUID;

import com.faouzi.portfolio.auth.infrastructure.persistence.AdminLoginAttemptRepository;
import com.faouzi.portfolio.auth.domain.model.AdminUser;
import com.faouzi.portfolio.auth.infrastructure.persistence.AdminUserRepository;
import com.faouzi.portfolio.auth.infrastructure.persistence.PasswordResetTokenRepository;
import com.faouzi.portfolio.audit.infrastructure.persistence.ActivityLogRepository;

import jakarta.servlet.http.Cookie;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminAuthControllerTests {

    private static final String EMAIL = "admin@example.test";
    private static final String PASSWORD = "SecurePassword-123";
    private static final String NEW_PASSWORD = "NewSecurePassword-456";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AdminUserRepository users;

    @Autowired
    private AdminLoginAttemptRepository loginAttempts;

    @Autowired
    private PasswordResetTokenRepository resetTokens;

    @Autowired
    private ActivityLogRepository activityLogs;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private Clock clock;

    @BeforeEach
    void setUp() {
        resetTokens.deleteAll();
        loginAttempts.deleteAll();
        activityLogs.deleteAll();
        users.deleteAll();
        users.save(new AdminUser(UUID.randomUUID(), EMAIL, passwordEncoder.encode(PASSWORD), false, Instant.now(clock)));
    }

    @Test
    void exposesCsrfTokenWithoutAuthentication() throws Exception {
        mockMvc.perform(get("/api/v1/admin/auth/csrf"))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("XSRF-TOKEN"))
                .andExpect(jsonPath("$.headerName", equalTo("X-XSRF-TOKEN")))
                .andExpect(jsonPath("$.token", notNullValue()));
    }

    @Test
    void logsInAndReturnsCurrentSession() throws Exception {
        MvcResult login = login(EMAIL, PASSWORD)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", equalTo(EMAIL)))
                .andReturn();

        mockMvc.perform(get("/api/v1/admin/auth/me").session((org.springframework.mock.web.MockHttpSession) login.getRequest().getSession(false)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", equalTo(EMAIL)));
    }

    @Test
    void rejectsInvalidCredentialsAndLocksAfterMaxFailures() throws Exception {
        for (int i = 0; i < 4; i++) {
            login(EMAIL, "wrong-password")
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.code", equalTo("INVALID_CREDENTIALS")));
        }

        login(EMAIL, "wrong-password")
                .andExpect(status().isUnauthorized());

        login(EMAIL, PASSWORD)
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.code", equalTo("LOGIN_LOCKED")));
    }

    @Test
    void requiresCsrfForLoginPost() throws Exception {
        mockMvc.perform(postJson("/api/v1/admin/auth/login", loginJson(EMAIL, PASSWORD)))
                .andExpect(status().isForbidden());
    }

    @Test
    void logsOutAndInvalidatesSession() throws Exception {
        MvcResult login = login(EMAIL, PASSWORD).andExpect(status().isOk()).andReturn();
        org.springframework.mock.web.MockHttpSession session =
                (org.springframework.mock.web.MockHttpSession) login.getRequest().getSession();

        mockMvc.perform(post("/api/v1/admin/auth/logout")
                        .with(csrf())
                        .session(session))
                .andExpect(status().isOk());

        assertThat(session.isInvalid()).isTrue();
    }

    @Test
    void requestsAndConsumesPasswordResetToken() throws Exception {
        MvcResult resetRequest = mockMvc.perform(postJson("/api/v1/admin/auth/forgot-password", """
                        {"email":"admin@example.test"}
                        """).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", notNullValue()))
                .andExpect(jsonPath("$.resetToken", notNullValue()))
                .andReturn();

        String token = com.jayway.jsonpath.JsonPath.read(resetRequest.getResponse().getContentAsString(), "$.resetToken");

        mockMvc.perform(postJson("/api/v1/admin/auth/reset-password", """
                        {"token":"%s","newPassword":"%s"}
                        """.formatted(token, NEW_PASSWORD)).with(csrf()))
                .andExpect(status().isOk());

        login(EMAIL, PASSWORD).andExpect(status().isUnauthorized());
        login(EMAIL, NEW_PASSWORD).andExpect(status().isOk());
    }

    private org.springframework.test.web.servlet.ResultActions login(String email, String password) throws Exception {
        return mockMvc.perform(postJson("/api/v1/admin/auth/login", loginJson(email, password)).with(csrf()));
    }

    private MockHttpServletRequestBuilder postJson(String url, String json) {
        return MockMvcRequestBuilders.post(url)
                .contentType("application/json")
                .content(json);
    }

    private String loginJson(String email, String password) {
        return """
                {"email":"%s","password":"%s"}
                """.formatted(email, password);
    }
}
