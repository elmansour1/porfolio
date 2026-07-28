import { FormControl, FormGroup } from '@angular/forms';

export type SettingsForm = FormGroup<{
  publicSiteName: FormControl<string>;
  monogram: FormControl<string>;
  defaultLanguage: FormControl<'fr' | 'en'>;
  activeFr: FormControl<boolean>;
  activeEn: FormControl<boolean>;
  contactRecipientEmail: FormControl<string>;
  footerCopyright: FormControl<string>;
  showCvDownload: FormControl<boolean>;
  showContactDetails: FormControl<boolean>;
  showSocialLinks: FormControl<boolean>;
  maintenanceMode: FormControl<boolean>;
  logoAltText: FormControl<string>;
}>;
