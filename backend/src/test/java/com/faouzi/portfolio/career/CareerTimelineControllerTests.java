package com.faouzi.portfolio.career;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.faouzi.portfolio.career.infrastructure.persistence.CareerCertificationRepository;
import com.faouzi.portfolio.career.infrastructure.persistence.CareerCertificationTranslationRepository;
import com.faouzi.portfolio.career.infrastructure.persistence.CareerEducationRepository;
import com.faouzi.portfolio.career.infrastructure.persistence.CareerEducationTranslationRepository;
import com.faouzi.portfolio.career.infrastructure.persistence.CareerExperienceRepository;
import com.faouzi.portfolio.career.infrastructure.persistence.CareerExperienceSkillRepository;
import com.faouzi.portfolio.career.infrastructure.persistence.CareerExperienceTranslationRepository;

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
class CareerTimelineControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CareerExperienceRepository experiences;

    @Autowired
    private CareerExperienceTranslationRepository experienceTranslations;

    @Autowired
    private CareerExperienceSkillRepository experienceSkills;

    @Autowired
    private CareerEducationRepository education;

    @Autowired
    private CareerEducationTranslationRepository educationTranslations;

    @Autowired
    private CareerCertificationRepository certifications;

    @Autowired
    private CareerCertificationTranslationRepository certificationTranslations;

    @BeforeEach
    void setUp() {
        experienceSkills.deleteAll();
        experienceTranslations.deleteAll();
        experiences.deleteAll();
        educationTranslations.deleteAll();
        education.deleteAll();
        certificationTranslations.deleteAll();
        certifications.deleteAll();
    }

    @Test
    void protectsAdminCareerEndpoints() throws Exception {
        mockMvc.perform(get("/api/v1/admin/experiences"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void publishesCareerItemsAndMasksConfidentialExperience() throws Exception {
        mockMvc.perform(postJson("/api/v1/admin/experiences", confidentialExperienceJson())
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.confidential", equalTo(true)));

        mockMvc.perform(postJson("/api/v1/admin/education", educationJson())
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isCreated());

        mockMvc.perform(postJson("/api/v1/admin/certifications", certificationJson())
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.expiryDate", nullValue()));

        mockMvc.perform(get("/api/v1/public/career?lang=fr"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.experiences[0].organization", equalTo("Client confidentiel")))
                .andExpect(jsonPath("$.experiences[0].organizationUrl", nullValue()))
                .andExpect(jsonPath("$.education[0].title", equalTo("Licence professionnelle")))
                .andExpect(jsonPath("$.certifications[0].name", equalTo("Certification Java")));
    }

    @Test
    void rejectsInvalidFinishedExperienceDates() throws Exception {
        mockMvc.perform(postJson("/api/v1/admin/experiences", confidentialExperienceJson()
                        .replace("\"endDate\": null", "\"endDate\": \"2022-12-31\"")
                        .replace("\"currentPosition\": true", "\"currentPosition\": false")
                        .replace("\"startDate\": \"2023-01-01\"", "\"startDate\": \"2023-02-01\""))
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code", equalTo("EXPERIENCE_DATES_INVALID")));
    }

    private MockHttpServletRequestBuilder postJson(String url, String json) {
        return post(url).contentType(MediaType.APPLICATION_JSON).content(json);
    }

    private String confidentialExperienceJson() {
        return """
                {
                  "publicationStatus": "PUBLISHED",
                  "experienceType": "FREELANCE",
                  "contractType": "FREELANCE",
                  "organization": "Client réel masqué",
                  "roleTitle": "Développeur backend Java",
                  "location": "Douala",
                  "workMode": "REMOTE",
                  "startDate": "2023-01-01",
                  "endDate": null,
                  "currentPosition": true,
                  "confidential": true,
                  "organizationUrl": "https://client.example",
                  "logoMediaId": null,
                  "displayOrder": 10,
                  "skillIds": [],
                  "translations": [
                    {
                      "languageCode": "fr",
                      "summary": "Conception et développement d'API métier.",
                      "missions": "Analyse, API REST, tests.",
                      "achievements": "Livrables validés sans donnée sensible.",
                      "confidentialLabel": "Client confidentiel"
                    },
                    {
                      "languageCode": "en",
                      "summary": "Business API design and delivery.",
                      "missions": "Analysis, REST API, tests.",
                      "achievements": "Validated deliverables without sensitive data.",
                      "confidentialLabel": "Confidential client"
                    }
                  ]
                }
                """;
    }

    private String educationJson() {
        return """
                {
                  "publicationStatus": "PUBLISHED",
                  "institution": "Institut Supérieur",
                  "educationLevel": "BACHELOR",
                  "location": "Cameroun",
                  "startDate": "2018-09-01",
                  "endDate": "2021-07-31",
                  "currentEducation": false,
                  "url": "https://school.example",
                  "logoMediaId": null,
                  "displayOrder": 20,
                  "translations": [
                    {"languageCode": "fr", "title": "Licence professionnelle", "field": "Génie logiciel", "description": "Parcours orienté développement logiciel."},
                    {"languageCode": "en", "title": "Professional bachelor", "field": "Software engineering", "description": "Software development curriculum."}
                  ]
                }
                """;
    }

    private String certificationJson() {
        return """
                {
                  "publicationStatus": "PUBLISHED",
                  "issuer": "Oracle",
                  "issueDate": "2024-01-15",
                  "expiryDate": null,
                  "noExpiry": true,
                  "credentialId": "CERT-123",
                  "verificationUrl": "https://verify.example/cert-123",
                  "documentMediaId": null,
                  "displayOrder": 30,
                  "translations": [
                    {"languageCode": "fr", "name": "Certification Java", "description": "Certification ajoutée uniquement avec données réelles."},
                    {"languageCode": "en", "name": "Java certification", "description": "Certification managed with real data only."}
                  ]
                }
                """;
    }
}
