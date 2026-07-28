import { AdminProfile, ProfileTranslation } from '../models/dto/profile.dto';
import { ProfileForm, ProfileTranslationForm } from '../models/forms/profile-form.model';

export function profileTranslation(
  profile: AdminProfile,
  languageCode: 'fr' | 'en',
): ProfileTranslation {
  return (
    profile.translations.find((translation) => translation.languageCode === languageCode) ?? {
      languageCode,
      professionalTitle: null,
      tagline: null,
      shortSummary: null,
      biography: null,
      aboutText: null,
      availabilityLabel: null,
      primaryCtaLabel: null,
      primaryCtaUrl: null,
      secondaryCtaLabel: null,
      secondaryCtaUrl: null,
      footerText: null,
    }
  );
}

export function profileTranslationFormValue(
  translation: ProfileTranslation,
): ProfileTranslationForm['value'] {
  return {
    professionalTitle: translation.professionalTitle ?? '',
    tagline: translation.tagline ?? '',
    shortSummary: translation.shortSummary ?? '',
    biography: translation.biography ?? '',
    aboutText: translation.aboutText ?? '',
    availabilityLabel: translation.availabilityLabel ?? '',
    primaryCtaLabel: translation.primaryCtaLabel ?? '',
    primaryCtaUrl: translation.primaryCtaUrl ?? '',
    secondaryCtaLabel: translation.secondaryCtaLabel ?? '',
    secondaryCtaUrl: translation.secondaryCtaUrl ?? '',
    footerText: translation.footerText ?? '',
  };
}

export function toAdminProfilePayload(
  current: AdminProfile,
  form: ProfileForm,
  links: AdminProfile['links'],
  statistics: AdminProfile['statistics'],
): AdminProfile {
  const value = form.getRawValue();
  return {
    ...current,
    publicationStatus: value.publicationStatus,
    firstName: value.firstName,
    lastName: value.lastName,
    displayName: value.displayName,
    location: value.location || null,
    country: value.country || null,
    availabilityStatus: value.availabilityStatus,
    professionalEmail: value.professionalEmail || null,
    phone: value.phone || null,
    showEmail: value.showEmail,
    showPhone: value.showPhone,
    showPhoto: value.showPhoto,
    showCv: value.showCv,
    showLinks: value.showLinks,
    showStatistics: value.showStatistics,
    translations: [
      { languageCode: 'fr', ...value.fr },
      { languageCode: 'en', ...value.en },
    ],
    links,
    statistics,
  };
}
