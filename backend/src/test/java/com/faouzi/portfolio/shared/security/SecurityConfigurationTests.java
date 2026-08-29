package com.faouzi.portfolio.shared.security;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityConfigurationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void allowsHealthCheckWithoutAuthentication() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk());
    }

    @Test
    void protectsAdminApiWithoutAuthentication() throws Exception {
        mockMvc.perform(get("/api/v1/admin/status"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void allowsPublicContactCsrfWithoutAuthentication() throws Exception {
        mockMvc.perform(get("/api/v1/public/contact/csrf"))
                .andExpect(status().isOk());
    }
}
