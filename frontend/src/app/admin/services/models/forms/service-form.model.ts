import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { PublicationStatus } from '../../../profile/models/dto/profile.dto';
import { ServiceCtaType } from '../dto/service.dto';

export type LocalizedTextGroup = FormGroup<{
  title: FormControl<string>;
  summary: FormControl<string>;
  description: FormControl<string>;
  problem: FormControl<string>;
  targetAudience: FormControl<string>;
  ctaLabel: FormControl<string>;
}>;

export type ServiceItemForm = FormGroup<{
  active: FormControl<boolean>;
  displayOrder: FormControl<number>;
  labelFr: FormControl<string>;
  descriptionFr: FormControl<string>;
  labelEn: FormControl<string>;
  descriptionEn: FormControl<string>;
}>;

export type ServiceForm = FormGroup<{
  id: FormControl<string | null>;
  slug: FormControl<string>;
  publicationStatus: FormControl<PublicationStatus>;
  featured: FormControl<boolean>;
  displayOrder: FormControl<number>;
  icon: FormControl<string>;
  visualUrl: FormControl<string>;
  ctaType: FormControl<ServiceCtaType | null>;
  ctaTarget: FormControl<string>;
  technologyIds: FormControl<string[]>;
  skillIds: FormControl<string[]>;
  fr: LocalizedTextGroup;
  en: LocalizedTextGroup;
  benefits: FormArray<ServiceItemForm>;
  deliverables: FormArray<ServiceItemForm>;
}>;

export type WorkProcessStepForm = FormGroup<{
  id: FormControl<string | null>;
  publicationStatus: FormControl<PublicationStatus>;
  displayOrder: FormControl<number>;
  icon: FormControl<string>;
  titleFr: FormControl<string>;
  descriptionFr: FormControl<string>;
  expectedResultFr: FormControl<string>;
  titleEn: FormControl<string>;
  descriptionEn: FormControl<string>;
  expectedResultEn: FormControl<string>;
}>;
