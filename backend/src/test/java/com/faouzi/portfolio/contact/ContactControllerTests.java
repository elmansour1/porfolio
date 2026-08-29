package com.faouzi.portfolio.contact;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.faouzi.portfolio.contact.infrastructure.persistence.ContactMessageRepository;
import com.faouzi.portfolio.contact.infrastructure.persistence.ContactRateLimitRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ContactControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ContactMessageRepository messages;

    @Autowired
    private ContactRateLimitRepository rateLimits;

    @BeforeEach
    void setUp() {
        messages.deleteAll();
        rateLimits.deleteAll();
    }

    @Test
    void protectsAdminMessagesEndpoints() throws Exception {
        mockMvc.perform(get("/api/v1/admin/messages"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void exposesCsrfTokenForPublicContact() throws Exception {
        mockMvc.perform(get("/api/v1/public/contact/csrf"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.headerName", equalTo("X-XSRF-TOKEN")))
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    void submitsContactMessageAndListsItInAdmin() throws Exception {
        mockMvc.perform(postJson("/api/v1/public/contact", contactJson("Jane Doe", "jane@example.test", null))
                        .with(csrf()))
                .andExpect(status().isAccepted());

        mockMvc.perform(get("/api/v1/admin/messages").with(user("admin@example.test")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andExpect(jsonPath("$.items[0].name", equalTo("Jane Doe")))
                .andExpect(jsonPath("$.items[0].email", equalTo("jane@example.test")))
                .andExpect(jsonPath("$.items[0].status", equalTo("NEW")));
    }

    @Test
    void rejectsSubmissionWithoutConsent() throws Exception {
        String payload = """
                {
                  "name": "John Doe",
                  "email": "john@example.test",
                  "company": null,
                  "requestType": "GENERAL",
                  "subject": "Bonjour",
                  "message": "Un message de test suffisamment long.",
                  "consent": false,
                  "website": ""
                }
                """;
        mockMvc.perform(postJson("/api/v1/public/contact", payload).with(csrf()))
                .andExpect(status().isBadRequest());

        mockMvc.perform(get("/api/v1/admin/messages").with(user("admin@example.test")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(0)));
    }

    @Test
    void ignoresSubmissionWhenHoneypotIsFilled() throws Exception {
        String payload = """
                {
                  "name": "Spam Bot",
                  "email": "spam@example.test",
                  "company": null,
                  "requestType": "GENERAL",
                  "subject": "Bonjour",
                  "message": "Un message de test suffisamment long.",
                  "consent": true,
                  "website": "https://spam.example"
                }
                """;
        mockMvc.perform(postJson("/api/v1/public/contact", payload).with(csrf()))
                .andExpect(status().isAccepted());

        mockMvc.perform(get("/api/v1/admin/messages").with(user("admin@example.test")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(0)));
    }

    @Test
    void enforcesRateLimitAfterConfiguredMaxSubmissions() throws Exception {
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(postJson("/api/v1/public/contact",
                            contactJson("Repeat Sender", "repeat" + i + "@example.test", null))
                            .with(csrf()))
                    .andExpect(status().isAccepted());
        }

        mockMvc.perform(postJson("/api/v1/public/contact", contactJson("Repeat Sender", "repeat5@example.test", null))
                        .with(csrf()))
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.code", equalTo("CONTACT_RATE_LIMITED")));
    }

    @Test
    void adminCanUpdateMessageStatus() throws Exception {
        mockMvc.perform(postJson("/api/v1/public/contact", contactJson("Alice", "alice@example.test", "Acme"))
                        .with(csrf()))
                .andExpect(status().isAccepted());

        String listResponse = mockMvc.perform(get("/api/v1/admin/messages").with(user("admin@example.test")))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        String id = extractId(listResponse);

        mockMvc.perform(put("/api/v1/admin/messages/{id}/status", id)
                        .with(user("admin@example.test"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"READ\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", equalTo("READ")));

        mockMvc.perform(get("/api/v1/admin/messages/{id}", id).with(user("admin@example.test")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", equalTo("READ")))
                .andExpect(jsonPath("$.company", equalTo("Acme")));
    }

    @Test
    void adminMessagesMetadataExposesStatusesAndRequestTypes() throws Exception {
        mockMvc.perform(get("/api/v1/admin/messages/metadata").with(user("admin@example.test")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.statuses", hasSize(6)))
                .andExpect(jsonPath("$.requestTypes", hasSize(5)));
    }

    private String contactJson(String name, String email, String company) {
        String companyValue = company == null ? "null" : "\"" + company + "\"";
        return """
                {
                  "name": "%s",
                  "email": "%s",
                  "company": %s,
                  "requestType": "GENERAL",
                  "subject": "Demande de contact",
                  "message": "Un message de test suffisamment long pour être valide.",
                  "consent": true,
                  "website": ""
                }
                """.formatted(name, email, companyValue);
    }

    private MockHttpServletRequestBuilder postJson(String path, String content) {
        return post(path).contentType(MediaType.APPLICATION_JSON).content(content);
    }

    private String extractId(String json) {
        int marker = json.indexOf("\"id\":\"");
        int start = marker + 6;
        int end = json.indexOf('"', start);
        return json.substring(start, end);
    }
}
