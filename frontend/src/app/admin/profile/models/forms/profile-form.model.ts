import { FormControl, FormGroup } from '@angular/forms';

import { AdminProfile } from '../dto/profile.dto';

export type ProfileTranslationForm = FormGroup<{
  professionalTitle: FormControl<string>;
  tagline: FormControl<string>;
  shortSummary: FormControl<string>;
  biography: FormControl<string>;
  aboutText: FormControl<string>;
  availabilityLabel: FormControl<string>;
  primaryCtaLabel: FormControl<string>;
  primaryCtaUrl: FormControl<string>;
  secondaryCtaLabel: FormControl<string>;
  secondaryCtaUrl: FormControl<string>;
  footerText: FormControl<string>;
}>;

export type ProfileForm = FormGroup<{
  publicationStatus: FormControl<AdminProfile['publicationStatus']>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  displayName: FormControl<string>;
  location: FormControl<string>;
  country: FormControl<string>;
  availabilityStatus: FormControl<AdminProfile['availabilityStatus']>;
  professionalEmail: FormControl<string>;
  phone: FormControl<string>;
  showEmail: FormControl<boolean>;
  showPhone: FormControl<boolean>;
  showPhoto: FormControl<boolean>;
  showCv: FormControl<boolean>;
  showLinks: FormControl<boolean>;
  showStatistics: FormControl<boolean>;
  photoAltText: FormControl<string>;
  fr: ProfileTranslationForm;
  en: ProfileTranslationForm;
}>;
