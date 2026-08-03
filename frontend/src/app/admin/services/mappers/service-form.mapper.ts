import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import {
  ServiceAdminDetail,
  ServiceBenefit,
  ServiceDeliverable,
  ServiceItemTranslation,
  ServicePayload,
  ServiceTranslation,
  WorkProcessStep,
  WorkProcessStepPayload,
  WorkProcessStepTranslation,
} from '../models/dto/service.dto';
import { ServiceForm, ServiceItemForm, WorkProcessStepForm } from '../models/forms/service-form.model';

const EMPTY_TRANSLATION = {
  title: '',
  summary: '',
  description: '',
  problem: '',
  targetAudience: '',
  ctaLabel: '',
};

export function createServiceForm(service?: ServiceAdminDetail | null): ServiceForm {
  const fr = serviceTranslation(service, 'fr');
  const en = serviceTranslation(service, 'en');
  return new FormGroup({
    id: new FormControl(service?.id ?? null),
    slug: new FormControl(service?.slug ?? '', { nonNullable: true }),
    publicationStatus: new FormControl(service?.publicationStatus ?? 'DRAFT', { nonNullable: true }),
    featured: new FormControl(service?.featured ?? false, { nonNullable: true }),
    displayOrder: new FormControl(service?.displayOrder ?? 0, { nonNullable: true, validators: [Validators.min(0)] }),
    icon: new FormControl(service?.icon ?? '', { nonNullable: true }),
    visualUrl: new FormControl(service?.visualUrl ?? '', { nonNullable: true }),
    ctaType: new FormControl(service?.ctaType ?? null),
    ctaTarget: new FormControl(service?.ctaTarget ?? '', { nonNullable: true }),
    technologyIds: new FormControl(service?.technologies.map((item) => item.id) ?? [], { nonNullable: true }),
    skillIds: new FormControl(service?.skills.map((item) => item.id) ?? [], { nonNullable: true }),
    fr: localizedGroup(fr),
    en: localizedGroup(en),
    benefits: new FormArray<ServiceItemForm>(
      (service?.benefits.length ? service.benefits : [emptyBenefit()]).map((item) => itemForm(item)),
    ),
    deliverables: new FormArray<ServiceItemForm>(
      (service?.deliverables.length ? service.deliverables : [emptyDeliverable()]).map((item) => itemForm(item)),
    ),
  });
}

export function createWorkProcessStepForm(step?: WorkProcessStep | null): WorkProcessStepForm {
  const fr = stepTranslation(step, 'fr');
  const en = stepTranslation(step, 'en');
  return new FormGroup({
    id: new FormControl(step?.id ?? null),
    publicationStatus: new FormControl(step?.publicationStatus ?? 'DRAFT', { nonNullable: true }),
    displayOrder: new FormControl(step?.displayOrder ?? 0, { nonNullable: true, validators: [Validators.min(0)] }),
    icon: new FormControl(step?.icon ?? '', { nonNullable: true }),
    titleFr: new FormControl(fr.title, { nonNullable: true, validators: [Validators.required] }),
    descriptionFr: new FormControl(fr.description ?? '', { nonNullable: true }),
    expectedResultFr: new FormControl(fr.expectedResult ?? '', { nonNullable: true }),
    titleEn: new FormControl(en.title, { nonNullable: true }),
    descriptionEn: new FormControl(en.description ?? '', { nonNullable: true }),
    expectedResultEn: new FormControl(en.expectedResult ?? '', { nonNullable: true }),
  });
}

export function servicePayload(form: ServiceForm): ServicePayload {
  const raw = form.getRawValue();
  return {
    slug: clean(raw.slug),
    featured: raw.featured,
    displayOrder: raw.displayOrder,
    icon: clean(raw.icon),
    visualUrl: clean(raw.visualUrl),
    ctaType: raw.ctaType,
    ctaTarget: clean(raw.ctaTarget),
    technologyIds: raw.technologyIds,
    skillIds: raw.skillIds,
    translations: [
      serviceTranslationPayload('fr', raw.fr),
      serviceTranslationPayload('en', raw.en),
    ].filter((translation) => translation.title.trim()),
    benefits: raw.benefits.map((item) => serviceItemPayload(item)),
    deliverables: raw.deliverables.map((item) => serviceItemPayload(item)),
  };
}

export function workProcessStepPayload(form: WorkProcessStepForm): WorkProcessStepPayload {
  const raw = form.getRawValue();
  return {
    displayOrder: raw.displayOrder,
    icon: clean(raw.icon),
    translations: [
      {
        languageCode: 'fr',
        title: raw.titleFr.trim(),
        description: clean(raw.descriptionFr),
        expectedResult: clean(raw.expectedResultFr),
      },
      {
        languageCode: 'en',
        title: raw.titleEn.trim(),
        description: clean(raw.descriptionEn),
        expectedResult: clean(raw.expectedResultEn),
      },
    ].filter((translation) => translation.title) as WorkProcessStepTranslation[],
  };
}

export function addEmptyItem(array: FormArray<ServiceItemForm>): void {
  array.push(itemForm(emptyBenefit()));
}

function localizedGroup(translation: ServiceTranslation): FormGroup {
  return new FormGroup({
    title: new FormControl(translation.title, { nonNullable: true, validators: [Validators.required] }),
    summary: new FormControl(translation.summary ?? '', { nonNullable: true }),
    description: new FormControl(translation.description ?? '', { nonNullable: true }),
    problem: new FormControl(translation.problem ?? '', { nonNullable: true }),
    targetAudience: new FormControl(translation.targetAudience ?? '', { nonNullable: true }),
    ctaLabel: new FormControl(translation.ctaLabel ?? '', { nonNullable: true }),
  });
}

function itemForm(item: ServiceBenefit | ServiceDeliverable): ServiceItemForm {
  const fr = itemTranslation(item, 'fr');
  const en = itemTranslation(item, 'en');
  return new FormGroup({
    active: new FormControl(item.active, { nonNullable: true }),
    displayOrder: new FormControl(item.displayOrder, { nonNullable: true, validators: [Validators.min(0)] }),
    labelFr: new FormControl(fr.label, { nonNullable: true, validators: [Validators.required] }),
    descriptionFr: new FormControl(fr.description ?? '', { nonNullable: true }),
    labelEn: new FormControl(en.label, { nonNullable: true }),
    descriptionEn: new FormControl(en.description ?? '', { nonNullable: true }),
  });
}

function serviceTranslation(service: ServiceAdminDetail | null | undefined, languageCode: 'fr' | 'en'): ServiceTranslation {
  return service?.translations.find((item) => item.languageCode === languageCode) ?? {
    languageCode,
    ...EMPTY_TRANSLATION,
  };
}

function itemTranslation(item: ServiceBenefit | ServiceDeliverable, languageCode: 'fr' | 'en'): ServiceItemTranslation {
  return item.translations.find((translation) => translation.languageCode === languageCode) ?? {
    languageCode,
    label: '',
    description: null,
  };
}

function stepTranslation(step: WorkProcessStep | null | undefined, languageCode: 'fr' | 'en'): WorkProcessStepTranslation {
  return step?.translations.find((item) => item.languageCode === languageCode) ?? {
    languageCode,
    title: '',
    description: null,
    expectedResult: null,
  };
}

function serviceTranslationPayload(languageCode: 'fr' | 'en', value: typeof EMPTY_TRANSLATION): ServiceTranslation {
  return {
    languageCode,
    title: value.title.trim(),
    summary: clean(value.summary),
    description: clean(value.description),
    problem: clean(value.problem),
    targetAudience: clean(value.targetAudience),
    ctaLabel: clean(value.ctaLabel),
  };
}

function serviceItemPayload(value: ServiceItemForm['value']): ServiceBenefit {
  return {
    id: null,
    active: value.active ?? true,
    displayOrder: value.displayOrder ?? 0,
    translations: ([
      { languageCode: 'fr', label: (value.labelFr ?? '').trim(), description: clean(value.descriptionFr) },
      { languageCode: 'en', label: (value.labelEn ?? '').trim(), description: clean(value.descriptionEn) },
    ] as ServiceItemTranslation[]).filter((translation) => translation.label),
  };
}

function emptyBenefit(): ServiceBenefit {
  return { id: null, active: true, displayOrder: 0, translations: [] };
}

function emptyDeliverable(): ServiceDeliverable {
  return { id: null, active: true, displayOrder: 0, translations: [] };
}

function clean(value: string | null | undefined): string | null {
  return value && value.trim() ? value.trim() : null;
}
