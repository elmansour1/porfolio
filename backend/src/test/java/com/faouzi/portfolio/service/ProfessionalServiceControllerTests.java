package com.faouzi.portfolio.service;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.faouzi.portfolio.service.infrastructure.persistence.ProfessionalServiceRepository;
import com.faouzi.portfolio.service.infrastructure.persistence.ProfessionalServiceTranslationRepository;
import com.faouzi.portfolio.service.infrastructure.persistence.ServiceBenefitRepository;
import com.faouzi.portfolio.service.infrastructure.persistence.ServiceBenefitTranslationRepository;
import com.faouzi.portfolio.service.infrastructure.persistence.ServiceDeliverableRepository;
import com.faouzi.portfolio.service.infrastructure.persistence.ServiceDeliverableTranslationRepository;
import com.faouzi.portfolio.service.infrastructure.persistence.ServiceSkillRepository;
import com.faouzi.portfolio.service.infrastructure.persistence.WorkProcessStepRepository;
import com.faouzi.portfolio.service.infrastructure.persistence.WorkProcessStepTranslationRepository;

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
class ProfessionalServiceControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProfessionalServiceRepository services;

    @Autowired
    private ProfessionalServiceTranslationRepository translations;

    @Autowired
    private ServiceBenefitRepository benefits;

    @Autowired
    private ServiceBenefitTranslationRepository benefitTranslations;

    @Autowired
    private ServiceDeliverableRepository deliverables;

    @Autowired
    private ServiceDeliverableTranslationRepository deliverableTranslations;

    @Autowired
    private ServiceSkillRepository serviceSkills;

    @Autowired
    private WorkProcessStepRepository steps;

    @Autowired
    private WorkProcessStepTranslationRepository stepTranslations;

    @BeforeEach
    void setUp() {
        serviceSkills.deleteAll();
        benefitTranslations.deleteAll();
        deliverableTranslations.deleteAll();
        benefits.deleteAll();
        deliverables.deleteAll();
        translations.deleteAll();
        services.deleteAll();
        stepTranslations.deleteAll();
        steps.deleteAll();
    }

    @Test
    void protectsAdminServiceEndpoints() throws Exception {
        mockMvc.perform(get("/api/v1/admin/services"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createsPublishesAndExposesServicePublicly() throws Exception {
        String response = mockMvc.perform(postJson("/api/v1/admin/services", serviceJson("api-rest", "CONTACT", null))
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.publicationStatus", equalTo("DRAFT")))
                .andReturn()
                .getResponse()
                .getContentAsString();
        String id = extractId(response);

        mockMvc.perform(get("/api/v1/public/services?lang=fr"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        mockMvc.perform(post("/api/v1/admin/services/{id}/publish", id)
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.publicationStatus", equalTo("PUBLISHED")));

        mockMvc.perform(put("/api/v1/admin/services/{id}/featured?value=true", id)
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.featured", equalTo(true)));

        mockMvc.perform(get("/api/v1/public/services?lang=fr"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", equalTo("Conception API REST")))
                .andExpect(jsonPath("$[0].ctaTarget", equalTo("#contact")))
                .andExpect(jsonPath("$[0].benefits", hasSize(1)))
                .andExpect(jsonPath("$[0].deliverables", hasSize(1)));
    }

    @Test
    void rejectsFeatureBeforePublication() throws Exception {
        String response = mockMvc.perform(postJson("/api/v1/admin/services", serviceJson("draft-service", "PROJECTS", null))
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        String id = extractId(response);

        mockMvc.perform(put("/api/v1/admin/services/{id}/featured?value=true", id)
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code", equalTo("SERVICE_FEATURED_INVALID")));
    }

    @Test
    void rejectsInvalidExternalCta() throws Exception {
        mockMvc.perform(postJson("/api/v1/admin/services", serviceJson("invalid-cta", "EXTERNAL_URL", "javascript:alert(1)"))
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code", equalTo("URL_INVALID")));
    }

    @Test
    void archivedServiceIsNotPublicAndNotFeatured() throws Exception {
        String response = mockMvc.perform(postJson("/api/v1/admin/services", serviceJson("archivable", "PROJECTS", null))
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        String id = extractId(response);

        mockMvc.perform(post("/api/v1/admin/services/{id}/publish", id).with(user("admin@example.test")).with(csrf()))
                .andExpect(status().isOk());
        mockMvc.perform(put("/api/v1/admin/services/{id}/featured?value=true", id).with(user("admin@example.test")).with(csrf()))
                .andExpect(status().isOk());
        mockMvc.perform(post("/api/v1/admin/services/{id}/archive", id).with(user("admin@example.test")).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.publicationStatus", equalTo("ARCHIVED")))
                .andExpect(jsonPath("$.featured", equalTo(false)));

        mockMvc.perform(get("/api/v1/public/services?lang=fr"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void publishesOnlyReadyWorkProcessSteps() throws Exception {
        String response = mockMvc.perform(postJson("/api/v1/admin/work-process-steps", """
                        {
                          "displayOrder": 10,
                          "icon": "pi pi-comments",
                          "translations": [
                            {"languageCode": "fr", "title": "Cadrage", "description": "Clarifier le besoin.", "expectedResult": "Périmètre clair"},
                            {"languageCode": "en", "title": "Scoping", "description": "Clarify the need.", "expectedResult": "Clear scope"}
                          ]
                        }
                        """)
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        String id = extractId(response);

        mockMvc.perform(get("/api/v1/public/services/work-process/steps?lang=fr"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        mockMvc.perform(post("/api/v1/admin/work-process-steps/{id}/publish", id)
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/v1/public/services/work-process/steps?lang=fr"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", equalTo("Cadrage")));
    }

    private String serviceJson(String slug, String ctaType, String ctaTarget) {
        String ctaTargetValue = ctaTarget == null ? "null" : "\"" + ctaTarget + "\"";
        return """
                {
                  "slug": "%s",
                  "featured": false,
                  "displayOrder": 10,
                  "icon": "pi pi-share-alt",
                  "visualUrl": null,
                  "ctaType": "%s",
                  "ctaTarget": %s,
                  "translations": [
                    {
                      "languageCode": "fr",
                      "title": "Conception API REST",
                      "summary": "Définir des contrats REST cohérents.",
                      "description": "Cadrage des ressources et des validations.",
                      "problem": "Éviter des APIs ambiguës.",
                      "targetAudience": "Équipes techniques.",
                      "ctaLabel": "Cadrer une API"
                    },
                    {
                      "languageCode": "en",
                      "title": "REST API design",
                      "summary": "Define consistent REST contracts.",
                      "description": "Resource and validation scoping.",
                      "problem": "Avoid ambiguous APIs.",
                      "targetAudience": "Technical teams.",
                      "ctaLabel": "Scope an API"
                    }
                  ],
                  "benefits": [
                    {
                      "active": true,
                      "displayOrder": 10,
                      "translations": [
                        {"languageCode": "fr", "label": "API documentée", "description": null},
                        {"languageCode": "en", "label": "Documented API", "description": null}
                      ]
                    }
                  ],
                  "deliverables": [
                    {
                      "active": true,
                      "displayOrder": 10,
                      "translations": [
                        {"languageCode": "fr", "label": "Documentation API", "description": null},
                        {"languageCode": "en", "label": "API documentation", "description": null}
                      ]
                    }
                  ],
                  "technologyIds": [],
                  "skillIds": []
                }
                """.formatted(slug, ctaType, ctaTargetValue);
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
