import {
  CareerCertification,
  CareerCertificationPayload,
  CareerEducation,
  CareerEducationPayload,
  CareerExperience,
  CareerExperiencePayload,
} from '../models/dto/career.dto';
import {
  CareerCertificationForm,
  CareerEducationForm,
  CareerExperienceForm,
} from '../models/forms/career-form.model';

export function experienceFormValue(experience: CareerExperience | null, fallbackOrder: number) {
  const fr = experience?.translations.find((translation) => translation.languageCode === 'fr');
  const en = experience?.translations.find((translation) => translation.languageCode === 'en');
  return {
    id: experience?.id ?? null,
    publicationStatus: experience?.publicationStatus ?? 'DRAFT',
    experienceType: experience?.experienceType ?? 'EMPLOYMENT',
    contractType: experience?.contractType ?? null,
    organization: experience?.organization ?? '',
    roleTitle: experience?.roleTitle ?? '',
    location: experience?.location ?? '',
    workMode: experience?.workMode ?? 'HYBRID',
    startDate: parseDate(experience?.startDate),
    endDate: parseDate(experience?.endDate),
    currentPosition: experience?.currentPosition ?? false,
    confidential: experience?.confidential ?? false,
    organizationUrl: experience?.organizationUrl ?? '',
    displayOrder: experience?.displayOrder ?? fallbackOrder,
    skillIds: experience?.skills.map((skill) => skill.id) ?? [],
    summaryFr: fr?.summary ?? '',
    missionsFr: fr?.missions ?? '',
    achievementsFr: fr?.achievements ?? '',
    confidentialLabelFr: fr?.confidentialLabel ?? 'Client confidentiel',
    summaryEn: en?.summary ?? '',
    missionsEn: en?.missions ?? '',
    achievementsEn: en?.achievements ?? '',
    confidentialLabelEn: en?.confidentialLabel ?? 'Confidential client',
  };
}

export function educationFormValue(item: CareerEducation | null, fallbackOrder: number) {
  const fr = item?.translations.find((translation) => translation.languageCode === 'fr');
  const en = item?.translations.find((translation) => translation.languageCode === 'en');
  return {
    id: item?.id ?? null,
    publicationStatus: item?.publicationStatus ?? 'DRAFT',
    institution: item?.institution ?? '',
    educationLevel: item?.educationLevel ?? null,
    location: item?.location ?? '',
    startDate: parseDate(item?.startDate),
    endDate: parseDate(item?.endDate),
    currentEducation: item?.currentEducation ?? false,
    url: item?.url ?? '',
    displayOrder: item?.displayOrder ?? fallbackOrder,
    titleFr: fr?.title ?? '',
    fieldFr: fr?.field ?? '',
    descriptionFr: fr?.description ?? '',
    titleEn: en?.title ?? '',
    fieldEn: en?.field ?? '',
    descriptionEn: en?.description ?? '',
  };
}

export function certificationFormValue(item: CareerCertification | null, fallbackOrder: number) {
  const fr = item?.translations.find((translation) => translation.languageCode === 'fr');
  const en = item?.translations.find((translation) => translation.languageCode === 'en');
  return {
    id: item?.id ?? null,
    publicationStatus: item?.publicationStatus ?? 'DRAFT',
    issuer: item?.issuer ?? '',
    issueDate: parseDate(item?.issueDate),
    expiryDate: parseDate(item?.expiryDate),
    noExpiry: item?.noExpiry ?? true,
    credentialId: item?.credentialId ?? '',
    verificationUrl: item?.verificationUrl ?? '',
    displayOrder: item?.displayOrder ?? fallbackOrder,
    nameFr: fr?.name ?? '',
    descriptionFr: fr?.description ?? '',
    nameEn: en?.name ?? '',
    descriptionEn: en?.description ?? '',
  };
}

export function toExperiencePayload(form: CareerExperienceForm): CareerExperiencePayload {
  const value = form.getRawValue();
  return {
    publicationStatus: value.publicationStatus,
    experienceType: value.experienceType,
    contractType: value.contractType,
    organization: blankToNull(value.organization),
    roleTitle: value.roleTitle.trim(),
    location: blankToNull(value.location),
    workMode: value.workMode,
    startDate: toDateString(value.startDate),
    endDate: value.currentPosition ? null : toDateString(value.endDate),
    currentPosition: value.currentPosition,
    confidential: value.confidential,
    organizationUrl: blankToNull(value.organizationUrl),
    logoMediaId: null,
    displayOrder: value.displayOrder,
    skillIds: value.skillIds,
    translations: [
      {
        languageCode: 'fr',
        summary: blankToNull(value.summaryFr),
        missions: blankToNull(value.missionsFr),
        achievements: blankToNull(value.achievementsFr),
        confidentialLabel: blankToNull(value.confidentialLabelFr),
      },
      {
        languageCode: 'en',
        summary: blankToNull(value.summaryEn),
        missions: blankToNull(value.missionsEn),
        achievements: blankToNull(value.achievementsEn),
        confidentialLabel: blankToNull(value.confidentialLabelEn),
      },
    ],
  };
}

export function toEducationPayload(form: CareerEducationForm): CareerEducationPayload {
  const value = form.getRawValue();
  return {
    publicationStatus: value.publicationStatus,
    institution: value.institution.trim(),
    educationLevel: value.educationLevel,
    location: blankToNull(value.location),
    startDate: toDateString(value.startDate),
    endDate: value.currentEducation ? null : toDateString(value.endDate),
    currentEducation: value.currentEducation,
    url: blankToNull(value.url),
    logoMediaId: null,
    displayOrder: value.displayOrder,
    translations: [
      {
        languageCode: 'fr',
        title: blankToNull(value.titleFr),
        field: blankToNull(value.fieldFr),
        description: blankToNull(value.descriptionFr),
      },
      {
        languageCode: 'en',
        title: blankToNull(value.titleEn),
        field: blankToNull(value.fieldEn),
        description: blankToNull(value.descriptionEn),
      },
    ],
  };
}

export function toCertificationPayload(form: CareerCertificationForm): CareerCertificationPayload {
  const value = form.getRawValue();
  return {
    publicationStatus: value.publicationStatus,
    issuer: value.issuer.trim(),
    issueDate: toDateString(value.issueDate),
    expiryDate: value.noExpiry ? null : dateStringOrNull(value.expiryDate),
    noExpiry: value.noExpiry,
    credentialId: blankToNull(value.credentialId),
    verificationUrl: blankToNull(value.verificationUrl),
    documentMediaId: null,
    displayOrder: value.displayOrder,
    translations: [
      { languageCode: 'fr', name: blankToNull(value.nameFr), description: blankToNull(value.descriptionFr) },
      { languageCode: 'en', name: blankToNull(value.nameEn), description: blankToNull(value.descriptionEn) },
    ],
  };
}

function parseDate(value: string | null | undefined): Date | null {
  return value ? new Date(`${value}T00:00:00`) : null;
}

function toDateString(value: Date | null): string {
  return dateStringOrNull(value) ?? '';
}

function dateStringOrNull(value: Date | null): string | null {
  if (!value) {
    return null;
  }
  return value.toISOString().slice(0, 10);
}

function blankToNull(value: string): string | null {
  const normalized = value.trim();
  return normalized.length ? normalized : null;
}
