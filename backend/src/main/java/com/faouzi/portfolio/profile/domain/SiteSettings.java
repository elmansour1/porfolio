package com.faouzi.portfolio.profile.domain;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

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

    protected SiteSettings() {
    }

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

    public UUID id() {
        return id;
    }

    public String publicSiteName() {
        return publicSiteName;
    }

    public String monogram() {
        return monogram;
    }

    public String defaultLanguage() {
        return defaultLanguage;
    }

    public String activeLanguages() {
        return activeLanguages;
    }

    public String contactRecipientEmail() {
        return contactRecipientEmail;
    }

    public String footerCopyright() {
        return footerCopyright;
    }

    public boolean showCvDownload() {
        return showCvDownload;
    }

    public boolean showContactDetails() {
        return showContactDetails;
    }

    public boolean showSocialLinks() {
        return showSocialLinks;
    }

    public boolean maintenanceMode() {
        return maintenanceMode;
    }

    public UUID logoMediaId() {
        return logoMediaId;
    }

    public UUID faviconMediaId() {
        return faviconMediaId;
    }

    private String blankToNull(String value) {
        return value == null || value.trim().isBlank() ? null : value.trim();
    }
}
