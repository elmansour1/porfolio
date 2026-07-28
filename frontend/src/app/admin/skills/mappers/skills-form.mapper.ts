import {
  Skill,
  SkillCategory,
  SkillCategoryPayload,
  SkillPayload,
  SkillTranslation,
} from '../models/dto/skills.dto';
import { SkillCategoryForm, SkillForm } from '../models/forms/skills-form.model';

export function categoryFormValue(
  category: SkillCategory | undefined,
  fallbackOrder: number,
): SkillCategoryForm['value'] {
  const fr = category ? categoryTranslation(category.translations, 'fr') : null;
  const en = category ? categoryTranslation(category.translations, 'en') : null;

  return {
    id: category?.id ?? null,
    publicationStatus: category?.publicationStatus ?? 'DRAFT',
    icon: category?.icon ?? '',
    displayOrder: category?.displayOrder ?? fallbackOrder,
    nameFr: fr?.name ?? '',
    descriptionFr: fr?.description ?? '',
    nameEn: en?.name ?? '',
    descriptionEn: en?.description ?? '',
  };
}

export function skillFormValue(
  skill: Skill | undefined,
  fallbackCategoryId: string | null,
  fallbackOrder: number,
): SkillForm['value'] {
  const fr = skill ? skillTranslation(skill.translations, 'fr') : null;
  const en = skill ? skillTranslation(skill.translations, 'en') : null;

  return {
    id: skill?.id ?? null,
    categoryId: skill?.categoryId ?? fallbackCategoryId,
    publicationStatus: skill?.publicationStatus ?? 'DRAFT',
    level: skill?.level ?? null,
    icon: skill?.icon ?? '',
    featured: skill?.featured ?? false,
    visible: skill?.visible ?? true,
    displayOrder: skill?.displayOrder ?? fallbackOrder,
    nameFr: fr?.name ?? '',
    descriptionFr: fr?.description ?? '',
    usageSummaryFr: fr?.usageSummary ?? '',
    nameEn: en?.name ?? '',
    descriptionEn: en?.description ?? '',
    usageSummaryEn: en?.usageSummary ?? '',
  };
}

export function toCategoryPayload(form: SkillCategoryForm): SkillCategoryPayload {
  return {
    publicationStatus: form.controls.publicationStatus.value,
    icon: blankToNull(form.controls.icon.value),
    displayOrder: form.controls.displayOrder.value,
    translations: [
      {
        languageCode: 'fr',
        name: form.controls.nameFr.value,
        description: blankToNull(form.controls.descriptionFr.value),
      },
      {
        languageCode: 'en',
        name: form.controls.nameEn.value,
        description: blankToNull(form.controls.descriptionEn.value),
      },
    ],
  };
}

export function toSkillPayload(form: SkillForm): SkillPayload {
  const categoryId = form.controls.categoryId.value;
  if (!categoryId) {
    throw new Error('A skill category is required.');
  }

  return {
    categoryId,
    publicationStatus: form.controls.publicationStatus.value,
    level: form.controls.level.value,
    icon: blankToNull(form.controls.icon.value),
    featured: form.controls.featured.value,
    visible: form.controls.visible.value,
    displayOrder: form.controls.displayOrder.value,
    translations: [
      {
        languageCode: 'fr',
        name: form.controls.nameFr.value,
        description: form.controls.descriptionFr.value,
        usageSummary: blankToNull(form.controls.usageSummaryFr.value),
      },
      {
        languageCode: 'en',
        name: form.controls.nameEn.value,
        description: form.controls.descriptionEn.value,
        usageSummary: blankToNull(form.controls.usageSummaryEn.value),
      },
    ],
  };
}

function categoryTranslation(
  translations: readonly { languageCode: string; name: string; description: string | null }[],
  language: 'fr' | 'en',
) {
  return translations.find((translation) => translation.languageCode === language);
}

function skillTranslation(translations: readonly SkillTranslation[], language: 'fr' | 'en') {
  return translations.find((translation) => translation.languageCode === language);
}

function blankToNull(value: string): string | null {
  return value.trim() ? value.trim() : null;
}
