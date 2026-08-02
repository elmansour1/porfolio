package com.faouzi.portfolio.project;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.faouzi.portfolio.project.infrastructure.persistence.ProjectLinkRepository;
import com.faouzi.portfolio.project.infrastructure.persistence.ProjectMediaRepository;
import com.faouzi.portfolio.project.infrastructure.persistence.ProjectRepository;
import com.faouzi.portfolio.project.infrastructure.persistence.ProjectSkillRepository;
import com.faouzi.portfolio.project.infrastructure.persistence.ProjectTranslationRepository;
import com.faouzi.portfolio.skills.infrastructure.persistence.SkillCategoryRepository;
import com.faouzi.portfolio.skills.infrastructure.persistence.SkillCategoryTranslationRepository;
import com.faouzi.portfolio.skills.infrastructure.persistence.SkillRepository;
import com.faouzi.portfolio.skills.infrastructure.persistence.SkillTranslationRepository;

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
class ProjectControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProjectRepository projects;

    @Autowired
    private ProjectTranslationRepository translations;

    @Autowired
    private ProjectSkillRepository projectSkills;

    @Autowired
    private ProjectLinkRepository links;

    @Autowired
    private ProjectMediaRepository media;

    @Autowired
    private SkillRepository skills;

    @Autowired
    private SkillTranslationRepository skillTranslations;

    @Autowired
    private SkillCategoryRepository categories;

    @Autowired
    private SkillCategoryTranslationRepository categoryTranslations;

    @BeforeEach
    void setUp() {
        media.deleteAll();
        links.deleteAll();
        projectSkills.deleteAll();
        translations.deleteAll();
        projects.deleteAll();
        skillTranslations.deleteAll();
        skills.deleteAll();
        categoryTranslations.deleteAll();
        categories.deleteAll();
    }

    @Test
    void protectsAdminProjectEndpoints() throws Exception {
        mockMvc.perform(get("/api/v1/admin/projects"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createsPublishesAndExposesPublicProject() throws Exception {
        String skillId = createSkill();

        String response = mockMvc.perform(postJson("/api/v1/admin/projects", publicProjectJson(skillId))
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.slug", equalTo("plateforme-saas")))
                .andExpect(jsonPath("$.publicationStatus", equalTo("PUBLISHED")))
                .andReturn()
                .getResponse()
                .getContentAsString();
        String id = extractId(response);

        mockMvc.perform(post("/api/v1/admin/projects/{id}/publish", id)
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/v1/public/projects?lang=fr"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andExpect(jsonPath("$.items[0].slug", equalTo("plateforme-saas")));

        mockMvc.perform(get("/api/v1/public/projects/{slug}?lang=fr", "plateforme-saas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", equalTo("Plateforme SaaS")))
                .andExpect(jsonPath("$.demoUrl", equalTo("https://demo.example")))
                .andExpect(jsonPath("$.githubUrl", equalTo("https://github.com/example/repo")))
                .andExpect(jsonPath("$.links", hasSize(1)));
    }

    @Test
    void masksSensitiveFieldsWhenAnonymized() throws Exception {
        String skillId = createSkill();

        mockMvc.perform(postJson("/api/v1/admin/projects", publicProjectJson(skillId)
                        .replace("\"confidentiality\": \"PUBLIC\"", "\"confidentiality\": \"ANONYMIZED\"")
                        .replace("\"slug\": \"plateforme-saas\"", "\"slug\": \"plateforme-anonyme\""))
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/v1/public/projects/{slug}?lang=fr", "plateforme-anonyme"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.demoUrl", nullValue()))
                .andExpect(jsonPath("$.githubUrl", nullValue()))
                .andExpect(jsonPath("$.links", hasSize(0)));
    }

    @Test
    void excludesPrivateProjectsFromPublicApi() throws Exception {
        String skillId = createSkill();

        mockMvc.perform(postJson("/api/v1/admin/projects", publicProjectJson(skillId)
                        .replace("\"confidentiality\": \"PUBLIC\"", "\"confidentiality\": \"PRIVATE\"")
                        .replace("\"slug\": \"plateforme-saas\"", "\"slug\": \"plateforme-privee\""))
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/v1/public/projects/{slug}?lang=fr", "plateforme-privee"))
                .andExpect(status().isNotFound());

        mockMvc.perform(get("/api/v1/public/projects?lang=fr"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(0)));
    }

    @Test
    void rejectsInvalidSlug() throws Exception {
        String skillId = createSkill();

        mockMvc.perform(postJson("/api/v1/admin/projects", publicProjectJson(skillId)
                        .replace("\"slug\": \"plateforme-saas\"", "\"slug\": \"Plateforme SaaS!\""))
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code", equalTo("PROJECT_SLUG_INVALID")));
    }

    @Test
    void rejectsDuplicateSlug() throws Exception {
        String skillId = createSkill();

        mockMvc.perform(postJson("/api/v1/admin/projects", publicProjectJson(skillId))
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isCreated());

        mockMvc.perform(postJson("/api/v1/admin/projects", publicProjectJson(skillId))
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code", equalTo("PROJECT_SLUG_TAKEN")));
    }

    @Test
    void rejectsPublishWithoutTitleAndSummary() throws Exception {
        String skillId = createSkill();

        String response = mockMvc.perform(postJson("/api/v1/admin/projects", draftProjectWithoutTranslationsJson(skillId))
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        String id = extractId(response);

        mockMvc.perform(post("/api/v1/admin/projects/{id}/publish", id)
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code", equalTo("PROJECT_NOT_PUBLISHABLE")));
    }

    @Test
    void deletesProject() throws Exception {
        String skillId = createSkill();

        String response = mockMvc.perform(postJson("/api/v1/admin/projects", publicProjectJson(skillId))
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        String id = extractId(response);

        mockMvc.perform(delete("/api/v1/admin/projects/{id}", id)
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/v1/admin/projects/{id}", id)
                        .with(user("admin@example.test")))
                .andExpect(status().isNotFound());
    }

    private String createSkill() throws Exception {
        String categoryResponse = mockMvc.perform(postJson("/api/v1/admin/skill-categories", """
                        {
                          "publicationStatus": "PUBLISHED",
                          "icon": "pi pi-code",
                          "displayOrder": 10,
                          "translations": [
                            {"languageCode": "fr", "name": "Backend", "description": "APIs"},
                            {"languageCode": "en", "name": "Backend", "description": "APIs"}
                          ]
                        }
                        """)
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        String categoryId = extractId(categoryResponse);

        String skillResponse = mockMvc.perform(postJson("/api/v1/admin/skills", """
                        {
                          "categoryId": "%s",
                          "publicationStatus": "PUBLISHED",
                          "level": "CORE_EXPERTISE",
                          "icon": "pi pi-code",
                          "featured": true,
                          "visible": true,
                          "displayOrder": 10,
                          "translations": [
                            {"languageCode": "fr", "name": "Java", "description": "Backend", "usageSummary": "API"},
                            {"languageCode": "en", "name": "Java", "description": "Backend", "usageSummary": "API"}
                          ]
                        }
                        """.formatted(categoryId))
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        return extractId(skillResponse);
    }

    private String extractId(String json) {
        int idStart = json.indexOf("\"id\":\"") + 6;
        return json.substring(idStart, json.indexOf('"', idStart));
    }

    private MockHttpServletRequestBuilder postJson(String url, String json) {
        return post(url).contentType(MediaType.APPLICATION_JSON).content(json);
    }

    private String publicProjectJson(String skillId) {
        return """
                {
                  "slug": "plateforme-saas",
                  "projectType": "SAAS_APPLICATION",
                  "realStatus": "COMPLETED",
                  "publicationStatus": "PUBLISHED",
                  "confidentiality": "PUBLIC",
                  "startDate": "2023-01-01",
                  "endDate": "2023-06-30",
                  "ongoing": false,
                  "featured": true,
                  "displayOrder": 10,
                  "demoUrl": "https://demo.example",
                  "githubUrl": "https://github.com/example/repo",
                  "indexable": true,
                  "skillIds": ["%s"],
                  "translations": [
                    {
                      "languageCode": "fr",
                      "title": "Plateforme SaaS",
                      "summary": "Une plateforme métier complète.",
                      "description": "Description détaillée.",
                      "context": "Contexte",
                      "problem": "Problème",
                      "objectives": "Objectifs",
                      "targetUsers": "Utilisateurs",
                      "role": "Développeur",
                      "responsibilities": "Responsabilités",
                      "solution": "Solution",
                      "architectureNotes": "Notes",
                      "features": "Fonctionnalités",
                      "challenges": "Défis",
                      "decisions": "Décisions",
                      "results": "Résultats",
                      "seoTitle": "SEO",
                      "seoDescription": "SEO description"
                    }
                  ],
                  "links": [
                    {"label": "Documentation", "url": "https://docs.example", "displayOrder": 10}
                  ]
                }
                """.formatted(skillId);
    }

    private String draftProjectWithoutTranslationsJson(String skillId) {
        return """
                {
                  "slug": "projet-brouillon",
                  "projectType": "PROTOTYPE",
                  "realStatus": "IN_PROGRESS",
                  "publicationStatus": "DRAFT",
                  "confidentiality": "PUBLIC",
                  "startDate": null,
                  "endDate": null,
                  "ongoing": true,
                  "featured": false,
                  "displayOrder": 20,
                  "demoUrl": null,
                  "githubUrl": null,
                  "indexable": true,
                  "skillIds": ["%s"],
                  "translations": [],
                  "links": []
                }
                """.formatted(skillId);
    }
}
