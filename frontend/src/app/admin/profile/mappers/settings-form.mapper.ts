import { AdminSiteSettings } from '../models/dto/profile.dto';
import { SettingsForm } from '../models/forms/settings-form.model';

export function toAdminSettingsPayload(
  current: AdminSiteSettings,
  form: SettingsForm,
  sections: AdminSiteSettings['sections'],
): AdminSiteSettings {
  const value = form.getRawValue();
  const activeLanguages: ('fr' | 'en')[] = [
    ...(value.activeFr ? (['fr'] as const) : []),
    ...(value.activeEn ? (['en'] as const) : []),
  ];

  return {
    ...current,
    publicSiteName: value.publicSiteName,
    monogram: value.monogram,
    defaultLanguage: value.defaultLanguage,
    activeLanguages,
    contactRecipientEmail: value.contactRecipientEmail || null,
    footerCopyright: value.footerCopyright || null,
    showCvDownload: value.showCvDownload,
    showContactDetails: value.showContactDetails,
    showSocialLinks: value.showSocialLinks,
    maintenanceMode: value.maintenanceMode,
    sections,
  };
}
