import { FormControl, FormGroup } from '@angular/forms';

import { PublicationStatus } from '../../../profile/models/dto/profile.dto';
import { SkillLevel } from '../dto/skills.dto';

export type SkillCategoryForm = FormGroup<{
  id: FormControl<string | null>;
  publicationStatus: FormControl<PublicationStatus>;
  icon: FormControl<string>;
  displayOrder: FormControl<number>;
  nameFr: FormControl<string>;
  descriptionFr: FormControl<string>;
  nameEn: FormControl<string>;
  descriptionEn: FormControl<string>;
}>;

export type SkillForm = FormGroup<{
  id: FormControl<string | null>;
  categoryId: FormControl<string | null>;
  publicationStatus: FormControl<PublicationStatus>;
  level: FormControl<SkillLevel | null>;
  icon: FormControl<string>;
  featured: FormControl<boolean>;
  visible: FormControl<boolean>;
  displayOrder: FormControl<number>;
  nameFr: FormControl<string>;
  descriptionFr: FormControl<string>;
  usageSummaryFr: FormControl<string>;
  nameEn: FormControl<string>;
  descriptionEn: FormControl<string>;
  usageSummaryEn: FormControl<string>;
}>;
