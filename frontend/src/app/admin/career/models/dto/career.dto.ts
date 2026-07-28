import { PublicationStatus } from '../../../profile/models/dto/profile.dto';
import { SelectOption } from '../../../../shared/models/select-option.model';

export type ExperienceType =
  | 'EMPLOYMENT'
  | 'FREELANCE'
  | 'INTERNSHIP'
  | 'MISSION'
  | 'VOLUNTEERING'
  | 'OTHER';

export type ContractType =
  | 'PERMANENT'
  | 'FIXED_TERM'
  | 'FREELANCE'
  | 'INTERNSHIP'
  | 'APPRENTICESHIP'
  | 'OTHER';

export type WorkMode = 'ON_SITE' | 'HYBRID' | 'REMOTE';

export type EducationLevel =
  | 'SECONDARY'
  | 'BACHELOR'
  | 'MASTER'
  | 'ENGINEERING'
  | 'DOCTORATE'
  | 'PROFESSIONAL_TRAINING'
  | 'CERTIFICATE'
  | 'OTHER';

export interface CareerMetadata {
  readonly publicationStatuses: SelectOption<PublicationStatus>[];
  readonly experienceTypes: SelectOption<ExperienceType>[];
  readonly contractTypes: SelectOption<ContractType>[];
  readonly workModes: SelectOption<WorkMode>[];
  readonly educationLevels: SelectOption<EducationLevel>[];
}

export interface CareerTranslation {
  readonly languageCode: 'fr' | 'en';
}

export interface CareerExperienceTranslation extends CareerTranslation {
  readonly summary: string | null;
  readonly missions: string | null;
  readonly achievements: string | null;
  readonly confidentialLabel: string | null;
}

export interface CareerSkillReference {
  readonly id: string;
  readonly name: string;
  readonly categoryName: string;
}

export interface CareerExperience {
  readonly id: string;
  readonly publicationStatus: PublicationStatus;
  readonly experienceType: ExperienceType;
  readonly contractType: ContractType | null;
  readonly organization: string | null;
  readonly roleTitle: string;
  readonly location: string | null;
  readonly workMode: WorkMode;
  readonly startDate: string;
  readonly endDate: string | null;
  readonly currentPosition: boolean;
  readonly confidential: boolean;
  readonly organizationUrl: string | null;
  readonly logoMediaId: string | null;
  readonly displayOrder: number;
  readonly translations: readonly CareerExperienceTranslation[];
  readonly skills: readonly CareerSkillReference[];
}

export interface CareerEducationTranslation extends CareerTranslation {
  readonly title: string | null;
  readonly field: string | null;
  readonly description: string | null;
}

export interface CareerEducation {
  readonly id: string;
  readonly publicationStatus: PublicationStatus;
  readonly institution: string;
  readonly educationLevel: EducationLevel | null;
  readonly location: string | null;
  readonly startDate: string;
  readonly endDate: string | null;
  readonly currentEducation: boolean;
  readonly url: string | null;
  readonly logoMediaId: string | null;
  readonly displayOrder: number;
  readonly translations: readonly CareerEducationTranslation[];
}

export interface CareerCertificationTranslation extends CareerTranslation {
  readonly name: string | null;
  readonly description: string | null;
}

export interface CareerCertification {
  readonly id: string;
  readonly publicationStatus: PublicationStatus;
  readonly issuer: string;
  readonly issueDate: string;
  readonly expiryDate: string | null;
  readonly noExpiry: boolean;
  readonly credentialId: string | null;
  readonly verificationUrl: string | null;
  readonly documentMediaId: string | null;
  readonly displayOrder: number;
  readonly translations: readonly CareerCertificationTranslation[];
}

export interface CareerExperiencePayload {
  readonly publicationStatus: PublicationStatus;
  readonly experienceType: ExperienceType;
  readonly contractType: ContractType | null;
  readonly organization: string | null;
  readonly roleTitle: string;
  readonly location: string | null;
  readonly workMode: WorkMode;
  readonly startDate: string;
  readonly endDate: string | null;
  readonly currentPosition: boolean;
  readonly confidential: boolean;
  readonly organizationUrl: string | null;
  readonly logoMediaId: string | null;
  readonly displayOrder: number;
  readonly translations: readonly CareerExperienceTranslation[];
  readonly skillIds: readonly string[];
}

export interface CareerEducationPayload {
  readonly publicationStatus: PublicationStatus;
  readonly institution: string;
  readonly educationLevel: EducationLevel | null;
  readonly location: string | null;
  readonly startDate: string;
  readonly endDate: string | null;
  readonly currentEducation: boolean;
  readonly url: string | null;
  readonly logoMediaId: string | null;
  readonly displayOrder: number;
  readonly translations: readonly CareerEducationTranslation[];
}

export interface CareerCertificationPayload {
  readonly publicationStatus: PublicationStatus;
  readonly issuer: string;
  readonly issueDate: string;
  readonly expiryDate: string | null;
  readonly noExpiry: boolean;
  readonly credentialId: string | null;
  readonly verificationUrl: string | null;
  readonly documentMediaId: string | null;
  readonly displayOrder: number;
  readonly translations: readonly CareerCertificationTranslation[];
}

export interface PublicCareer {
  readonly language: 'fr' | 'en';
  readonly experiences: readonly PublicCareerExperience[];
  readonly education: readonly PublicCareerEducation[];
  readonly certifications: readonly PublicCareerCertification[];
}

export interface PublicCareerExperience {
  readonly organization: string | null;
  readonly roleTitle: string;
  readonly location: string | null;
  readonly startDate: string;
  readonly endDate: string | null;
  readonly currentPosition: boolean;
  readonly confidential: boolean;
  readonly summary: string | null;
  readonly missions: string | null;
  readonly achievements: string | null;
  readonly skills: readonly CareerSkillReference[];
}

export interface PublicCareerEducation {
  readonly institution: string;
  readonly title: string | null;
  readonly field: string | null;
  readonly startDate: string;
  readonly endDate: string | null;
  readonly currentEducation: boolean;
  readonly description: string | null;
  readonly url: string | null;
}

export interface PublicCareerCertification {
  readonly issuer: string;
  readonly issueDate: string;
  readonly expiryDate: string | null;
  readonly noExpiry: boolean;
  readonly credentialId: string | null;
  readonly verificationUrl: string | null;
  readonly name: string | null;
  readonly description: string | null;
}
