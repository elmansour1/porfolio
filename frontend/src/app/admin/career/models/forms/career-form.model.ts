import { FormControl, FormGroup } from '@angular/forms';

import { PublicationStatus } from '../../../profile/models/dto/profile.dto';
import {
  ContractType,
  EducationLevel,
  ExperienceType,
  WorkMode,
} from '../dto/career.dto';

export type CareerExperienceForm = FormGroup<{
  id: FormControl<string | null>;
  publicationStatus: FormControl<PublicationStatus>;
  experienceType: FormControl<ExperienceType>;
  contractType: FormControl<ContractType | null>;
  organization: FormControl<string>;
  roleTitle: FormControl<string>;
  location: FormControl<string>;
  workMode: FormControl<WorkMode>;
  startDate: FormControl<Date | null>;
  endDate: FormControl<Date | null>;
  currentPosition: FormControl<boolean>;
  confidential: FormControl<boolean>;
  organizationUrl: FormControl<string>;
  displayOrder: FormControl<number>;
  skillIds: FormControl<string[]>;
  summaryFr: FormControl<string>;
  missionsFr: FormControl<string>;
  achievementsFr: FormControl<string>;
  confidentialLabelFr: FormControl<string>;
  summaryEn: FormControl<string>;
  missionsEn: FormControl<string>;
  achievementsEn: FormControl<string>;
  confidentialLabelEn: FormControl<string>;
}>;

export type CareerEducationForm = FormGroup<{
  id: FormControl<string | null>;
  publicationStatus: FormControl<PublicationStatus>;
  institution: FormControl<string>;
  educationLevel: FormControl<EducationLevel | null>;
  location: FormControl<string>;
  startDate: FormControl<Date | null>;
  endDate: FormControl<Date | null>;
  currentEducation: FormControl<boolean>;
  url: FormControl<string>;
  displayOrder: FormControl<number>;
  titleFr: FormControl<string>;
  fieldFr: FormControl<string>;
  descriptionFr: FormControl<string>;
  titleEn: FormControl<string>;
  fieldEn: FormControl<string>;
  descriptionEn: FormControl<string>;
}>;

export type CareerCertificationForm = FormGroup<{
  id: FormControl<string | null>;
  publicationStatus: FormControl<PublicationStatus>;
  issuer: FormControl<string>;
  issueDate: FormControl<Date | null>;
  expiryDate: FormControl<Date | null>;
  noExpiry: FormControl<boolean>;
  credentialId: FormControl<string>;
  verificationUrl: FormControl<string>;
  displayOrder: FormControl<number>;
  nameFr: FormControl<string>;
  descriptionFr: FormControl<string>;
  nameEn: FormControl<string>;
  descriptionEn: FormControl<string>;
}>;
