package com.faouzi.portfolio.profile.domain.model;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "site_settings")
public class SiteSettings {

    @Id
    private UUID id;

    @Column(name = "public_site_name", nullable = false, length = 180)
    private String publicSiteName;

    @Column(nullable = false, length = 12)
    private String monogram;

    @Column(name = "default_language", nullable = false, length = 2)
    private String defaultLanguage;

    @Column(name = "active_languages", nullable = false, length = 20)
    private String activeLanguages;

    @Column(name = "contact_recipient_email", length = 320)
    private String contactRecipientEmail;

    @Column(name = "footer_copyright", length = 240)
    private String footerCopyright;

    @Column(name = "show_cv_download", nullable = false)
    private boolean showCvDownload;

    @Column(name = "show_contact_details", nullable = false)
    private boolean showContactDetails;

    @Column(name = "show_social_links", nullable = false)
    private boolean showSocialLinks;

    @Column(name = "maintenance_mode", nullable = false)
    private boolean maintenanceMode;

    @Column(name = "logo_media_id")
    private UUID logoMediaId;

    @Column(name = "favicon_media_id")
    private UUID faviconMediaId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public SiteSettings(UUID id, Instant now) {
        this.id = id;
        this.publicSiteName = "Portfolio professionnel";
        this.monogram = "FE";
        this.defaultLanguage = "fr";
        this.activeLanguages = "fr,en";
        this.showCvDownload = false;
        this.showContactDetails = false;
        this.showSocialLinks = true;
        this.maintenanceMode = false;
        this.createdAt = now;
        this.updatedAt = now;
    }

    public void update(
            String publicSiteName,
            String monogram,
            String defaultLanguage,
            String activeLanguages,
            String contactRecipientEmail,
            String footerCopyright,
            boolean showCvDownload,
            boolean showContactDetails,
            boolean showSocialLinks,
            boolean maintenanceMode,
            Instant now
    ) {
        this.publicSiteName = publicSiteName.trim();
        this.monogram = monogram.trim();
        this.defaultLanguage = defaultLanguage;
        this.activeLanguages = activeLanguages;
        this.contactRecipientEmail = blankToNull(contactRecipientEmail);
        this.footerCopyright = blankToNull(footerCopyright);
        this.showCvDownload = showCvDownload;
        this.showContactDetails = showContactDetails;
        this.showSocialLinks = showSocialLinks;
        this.maintenanceMode = maintenanceMode;
        this.updatedAt = now;
    }

    public void attachLogo(UUID mediaId, Instant now) {
        this.logoMediaId = mediaId;
        this.updatedAt = now;
    }

    public void removeLogo(Instant now) {
        this.logoMediaId = null;
        this.updatedAt = now;
    }

    public void attachFavicon(UUID mediaId, Instant now) {
        this.faviconMediaId = mediaId;
        this.updatedAt = now;
    }

    public void removeFavicon(Instant now) {
        this.faviconMediaId = null;
        this.updatedAt = now;
    }

    private String blankToNull(String value) {
        return value == null || value.trim().isBlank() ? null : value.trim();
    }
}
