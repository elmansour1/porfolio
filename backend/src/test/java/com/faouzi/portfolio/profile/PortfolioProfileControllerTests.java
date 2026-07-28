package com.faouzi.portfolio.profile;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.faouzi.portfolio.profile.infrastructure.persistence.PortfolioSectionSettingRepository;
import com.faouzi.portfolio.profile.infrastructure.persistence.ProfessionalLinkRepository;
import com.faouzi.portfolio.profile.infrastructure.persistence.ProfessionalProfileRepository;
import com.faouzi.portfolio.profile.infrastructure.persistence.ProfessionalProfileTranslationRepository;
import com.faouzi.portfolio.profile.infrastructure.persistence.ProfessionalStatisticRepository;
import com.faouzi.portfolio.profile.infrastructure.persistence.ProfileMediaRepository;
import com.faouzi.portfolio.profile.infrastructure.persistence.SiteSettingsRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PortfolioProfileControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProfessionalLinkRepository links;

    @Autowired
    private ProfessionalStatisticRepository statistics;

    @Autowired
    private ProfessionalProfileTranslationRepository translations;

    @Autowired
    private PortfolioSectionSettingRepository sections;

    @Autowired
    private SiteSettingsRepository settings;

    @Autowired
    private ProfessionalProfileRepository profiles;

    @Autowired
    private ProfileMediaRepository media;

    @BeforeEach
    void setUp() {
        links.deleteAll();
        statistics.deleteAll();
        translations.deleteAll();
        sections.deleteAll();
        settings.deleteAll();
        profiles.deleteAll();
        media.deleteAll();
    }

    @Test
    void protectsAdminProfileEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/admin/profile"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void savesAdminProfileAndMasksPrivatePublicFields() throws Exception {
        mockMvc.perform(putJson("/api/v1/admin/profile", publishedProfileJson()).with(user("admin@example.test")).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.displayName", equalTo("Faouzi El Mansour")))
                .andExpect(jsonPath("$.links[0].label", equalTo("GitHub")))
                .andExpect(jsonPath("$.statistics[0].labelFr", equalTo("Années d'expérience")));

        mockMvc.perform(get("/api/v1/public/portfolio?lang=fr"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.profilePublished", equalTo(true)))
                .andExpect(jsonPath("$.profile.displayName", equalTo("Faouzi El Mansour")))
                .andExpect(jsonPath("$.profile.professionalEmail", nullValue()))
                .andExpect(jsonPath("$.profile.statistics[0].label", equalTo("Années d'expérience")));
    }

    @Test
    void updatesExistingProfileTranslationForSameLocale() throws Exception {
        mockMvc.perform(putJson("/api/v1/admin/profile", publishedProfileJson()).with(user("admin@example.test")).with(csrf()))
                .andExpect(status().isOk());

        mockMvc.perform(putJson("/api/v1/admin/profile", publishedProfileJson()
                        .replace("Je conçois des applications web robustes.", "Je conçois des plateformes web maintenables."))
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.translations[0].shortSummary", equalTo("Je conçois des plateformes web maintenables.")));

        mockMvc.perform(get("/api/v1/public/portfolio?lang=fr"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.profile.shortSummary", equalTo("Je conçois des plateformes web maintenables.")));
    }

    @Test
    void rejectsInvalidProfessionalLinkUrl() throws Exception {
        mockMvc.perform(putJson("/api/v1/admin/profile", publishedProfileJson().replace("https://github.com/faouzi", "javascript:alert(1)"))
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code", equalTo("URL_INVALID")));
    }

    @Test
    void updatesTypedSettingsAndSectionVisibility() throws Exception {
        mockMvc.perform(get("/api/v1/admin/settings").with(user("admin@example.test")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sections.length()", equalTo(10)));

        mockMvc.perform(putJson("/api/v1/admin/settings", settingsJson()).with(user("admin@example.test")).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.publicSiteName", equalTo("Faouzi Portfolio")))
                .andExpect(jsonPath("$.sections[0].visible", equalTo(false)));

        mockMvc.perform(get("/api/v1/public/portfolio?lang=en"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.settings.publicSiteName", equalTo("Faouzi Portfolio")))
                .andExpect(jsonPath("$.settings.contactRecipientEmail").doesNotExist());
    }

    @Test
    void acceptsCvPdfAndRejectsInvalidProfilePhoto() throws Exception {
        MockMultipartFile pdf = new MockMultipartFile("file", "cv.pdf", "application/pdf", "%PDF".getBytes());
        mockMvc.perform(multipart("/api/v1/admin/profile/cv")
                        .file(pdf)
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cv.contentType", equalTo("application/pdf")));

        MockMultipartFile script = new MockMultipartFile("file", "avatar.html", "text/html", "<script></script>".getBytes());
        mockMvc.perform(multipart("/api/v1/admin/profile/photo")
                        .file(script)
                        .with(user("admin@example.test"))
                        .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code", equalTo("MEDIA_TYPE_NOT_ALLOWED")));
    }

    private MockHttpServletRequestBuilder putJson(String url, String json) {
        return put(url).contentType(MediaType.APPLICATION_JSON).content(json);
    }

    private String publishedProfileJson() {
        return """
                {
                  "publicationStatus": "PUBLISHED",
                  "firstName": "Faouzi",
                  "lastName": "El Mansour",
                  "displayName": "Faouzi El Mansour",
                  "location": "Douala",
                  "country": "Cameroun",
                  "availabilityStatus": "OPEN_TO_OPPORTUNITIES",
                  "professionalEmail": "faouzi@example.com",
                  "phone": "+237600000000",
                  "showEmail": false,
                  "showPhone": false,
                  "showPhoto": true,
                  "showCv": false,
                  "showLinks": true,
                  "showStatistics": true,
                  "translations": [
                    {
                      "languageCode": "fr",
                      "professionalTitle": "Développeur Full Stack Java Angular",
                      "tagline": "Applications robustes et maintenables",
                      "shortSummary": "Je conçois des applications web robustes.",
                      "biography": "Parcours à compléter avec des contenus réels.",
                      "aboutText": "Approche structurée de la conception au déploiement.",
                      "availabilityLabel": "Ouvert aux opportunités",
                      "primaryCtaLabel": "Me contacter",
                      "primaryCtaUrl": "mailto:faouzi@example.com",
                      "secondaryCtaLabel": "GitHub",
                      "secondaryCtaUrl": "https://github.com/faouzi",
                      "footerText": "Portfolio professionnel."
                    }
                  ],
                  "links": [
                    {
                      "type": "GITHUB",
                      "label": "GitHub",
                      "url": "https://github.com/faouzi",
                      "icon": "github",
                      "displayOrder": 10,
                      "visible": true,
                      "openInNewTab": true
                    }
                  ],
                  "statistics": [
                    {
                      "value": "5+",
                      "labelFr": "Années d'expérience",
                      "labelEn": "Years of experience",
                      "displayOrder": 10,
                      "visible": true
                    }
                  ]
                }
                """;
    }

    private String settingsJson() {
        return """
                {
                  "publicSiteName": "Faouzi Portfolio",
                  "monogram": "FE",
                  "defaultLanguage": "fr",
                  "activeLanguages": ["fr", "en"],
                  "contactRecipientEmail": "admin@example.com",
                  "footerCopyright": "© 2026 Faouzi El Mansour",
                  "showCvDownload": true,
                  "showContactDetails": false,
                  "showSocialLinks": true,
                  "maintenanceMode": false,
                  "sections": [
                    {"sectionKey": "HERO", "visible": false, "displayOrder": 10},
                    {"sectionKey": "ABOUT", "visible": true, "displayOrder": 20}
                  ]
                }
                """;
    }
}
