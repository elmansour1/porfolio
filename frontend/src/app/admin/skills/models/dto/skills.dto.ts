import { PublicationStatus } from '../../../profile/models/dto/profile.dto';
import { SelectOption } from '../../../../shared/models/select-option.model';

export type SkillLevel = 'NOTIONS' | 'OPERATIONAL' | 'ADVANCED' | 'CORE_EXPERTISE';

export interface SkillCategoryTranslation {
  readonly languageCode: 'fr' | 'en';
  readonly name: string;
  readonly description: string | null;
}

export interface SkillTranslation {
  readonly languageCode: 'fr' | 'en';
  readonly name: string;
  readonly description: string | null;
  readonly usageSummary: string | null;
}

export interface SkillCategory {
  readonly id: string;
  readonly publicationStatus: PublicationStatus;
  readonly icon: string | null;
  readonly displayOrder: number;
  readonly skillCount: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly translations: readonly SkillCategoryTranslation[];
}

export interface Skill {
  readonly id: string;
  readonly categoryId: string;
  readonly categoryNameFr: string;
  readonly publicationStatus: PublicationStatus;
  readonly level: SkillLevel | null;
  readonly icon: string | null;
  readonly featured: boolean;
  readonly visible: boolean;
  readonly displayOrder: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly translations: readonly SkillTranslation[];
}

export interface SkillMetadata {
  readonly publicationStatuses: readonly SelectOption<PublicationStatus>[];
  readonly levels: readonly SelectOption<SkillLevel>[];
}

export interface SkillCategoryPayload {
  readonly publicationStatus: PublicationStatus;
  readonly icon: string | null;
  readonly displayOrder: number;
  readonly translations: readonly {
    readonly languageCode: 'fr' | 'en';
    readonly name: string;
    readonly description: string | null;
  }[];
}

export interface SkillPayload {
  readonly categoryId: string;
  readonly publicationStatus: PublicationStatus;
  readonly level: Skill['level'];
  readonly icon: string | null;
  readonly featured: boolean;
  readonly visible: boolean;
  readonly displayOrder: number;
  readonly translations: readonly {
    readonly languageCode: 'fr' | 'en';
    readonly name: string;
    readonly description: string | null;
    readonly usageSummary: string | null;
  }[];
}

export interface SkillFilters {
  readonly categoryId?: string | null;
  readonly status?: PublicationStatus | null;
  readonly featured?: boolean | null;
  readonly query?: string | null;
}

export interface PublicSkills {
  readonly language: 'fr' | 'en';
  readonly featuredSkills: readonly PublicSkill[];
  readonly categories: readonly PublicSkillCategory[];
}

export interface PublicSkillCategory {
  readonly name: string;
  readonly description: string | null;
  readonly icon: string | null;
  readonly displayOrder: number;
  readonly skills: readonly PublicSkill[];
}

export interface PublicSkill {
  readonly name: string;
  readonly description: string | null;
  readonly usageSummary: string | null;
  readonly level: SkillLevel | null;
  readonly icon: string | null;
  readonly featured: boolean;
  readonly displayOrder: number;
}
