package com.faouzi.portfolio.skills;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import com.faouzi.portfolio.skills.infrastructure.persistence.SkillCategoryRepository;
import com.faouzi.portfolio.skills.infrastructure.persistence.SkillCategoryTranslationRepository;
import com.faouzi.portfolio.skills.infrastructure.persistence.SkillRepository;
import com.faouzi.portfolio.skills.infrastructure.persistence.SkillTranslationRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SkillCatalogControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SkillTranslationRepository skillTranslations;

    @Autowired
    private SkillRepository skills;

    @Autowired
    private SkillCategoryTranslationRepository categoryTranslations;

    @Autowired
    private SkillCategoryRepository categories;

    @BeforeEach
    void setUp() {
        skillTranslations.deleteAll();
        skills.deleteAll();
        categoryTranslations.deleteAll();
        categories.deleteAll();
    }

    @Test
    void protectsAdminSkillsEndpoints() throws Exception {
        mockMvc.perform(get("/api/v1/admin/skills"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createsCategoryAndSkillThenReturnsOnlyPublishedPublicContent() throws Exception {
        String categoryId = createCategory(publishedCategoryJson("Backend", "Backend"));

        mockMvc.perform(postJson("/api/v1/admin/skills", publishedSkillJson(categoryId))
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.translations[0].name", equalTo("Java")))
                .andExpect(jsonPath("$.level", equalTo("CORE_EXPERTISE")));

        mockMvc.perform(postJson("/api/v1/admin/skills", draftSkillJson(categoryId))
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/v1/public/skills?lang=fr"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.categories", hasSize(1)))
                .andExpect(jsonPath("$.categories[0].name", equalTo("Backend")))
                .andExpect(jsonPath("$.categories[0].skills", hasSize(1)))
                .andExpect(jsonPath("$.categories[0].skills[0].name", equalTo("Java")))
                .andExpect(jsonPath("$.featuredSkills", hasSize(1)));
    }

    @Test
    void rejectsSkillCreationWithUnknownCategory() throws Exception {
        mockMvc.perform(postJson("/api/v1/admin/skills", publishedSkillJson(UUID.randomUUID().toString()))
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code", equalTo("CATEGORY_NOT_FOUND")));
    }

    @Test
    void keepsSkillPrivateWhenCategoryIsArchived() throws Exception {
        String categoryId = createCategory(publishedCategoryJson("Frontend", "Frontend"));
        mockMvc.perform(postJson("/api/v1/admin/skills", publishedSkillJson(categoryId))
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/v1/admin/skill-categories/{id}/archive", categoryId)
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/v1/public/skills?lang=fr"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.categories", hasSize(0)))
                .andExpect(jsonPath("$.featuredSkills", hasSize(0)));
    }

    @Test
    void rejectsDuplicateTranslationLanguages() throws Exception {
        mockMvc.perform(postJson("/api/v1/admin/skill-categories", """
                        {
                          "publicationStatus": "DRAFT",
                          "icon": "pi pi-code",
                          "displayOrder": 10,
                          "translations": [
                            {"languageCode": "fr", "name": "Backend", "description": "APIs"},
                            {"languageCode": "fr", "name": "Serveur", "description": "Doublon"}
                          ]
                        }
                        """)
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code", equalTo("DUPLICATE_TRANSLATION")));
    }

    private String createCategory(String json) throws Exception {
        String response = mockMvc.perform(postJson("/api/v1/admin/skill-categories", json)
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        int idStart = response.indexOf("\"id\":\"") + 6;
        return response.substring(idStart, response.indexOf('"', idStart));
    }

    private MockHttpServletRequestBuilder postJson(String url, String json) {
        return post(url).contentType(MediaType.APPLICATION_JSON).content(json);
    }

    private MockHttpServletRequestBuilder putJson(String url, String json) {
        return put(url).contentType(MediaType.APPLICATION_JSON).content(json);
    }

    private String publishedCategoryJson(String nameFr, String nameEn) {
        return """
                {
                  "publicationStatus": "PUBLISHED",
                  "icon": "pi pi-server",
                  "displayOrder": 10,
                  "translations": [
                    {"languageCode": "fr", "name": "%s", "description": "APIs et logique métier"},
                    {"languageCode": "en", "name": "%s", "description": "APIs and business logic"}
                  ]
                }
                """.formatted(nameFr, nameEn);
    }

    private String publishedSkillJson(String categoryId) {
        return """
                {
                  "categoryId": "%s",
                  "publicationStatus": "PUBLISHED",
                  "level": "CORE_EXPERTISE",
                  "icon": "pi pi-code",
                  "featured": true,
                  "visible": true,
                  "displayOrder": 10,
                  "translations": [
                    {
                      "languageCode": "fr",
                      "name": "Java",
                      "description": "Développement backend robuste.",
                      "usageSummary": "Conception d'API et services métier."
                    },
                    {
                      "languageCode": "en",
                      "name": "Java",
                      "description": "Robust backend development.",
                      "usageSummary": "API and business services design."
                    }
                  ]
                }
                """.formatted(categoryId);
    }

    private String draftSkillJson(String categoryId) {
        return publishedSkillJson(categoryId)
                .replace("\"publicationStatus\": \"PUBLISHED\"", "\"publicationStatus\": \"DRAFT\"")
                .replace("\"featured\": true", "\"featured\": false")
                .replace("\"name\": \"Java\"", "\"name\": \"Spring Boot\"");
    }
}
