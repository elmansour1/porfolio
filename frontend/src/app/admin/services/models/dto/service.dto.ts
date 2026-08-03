import { PublicationStatus } from '../../../profile/models/dto/profile.dto';
import { SelectOption } from '../../../../shared/models/select-option.model';

export type ServiceCtaType = 'CONTACT' | 'PROJECTS' | 'EMAIL' | 'RESUME' | 'EXTERNAL_URL';

export interface ServiceReference {
  readonly id: string;
  readonly name: string;
  readonly categoryName: string;
}

export interface ServiceMetadata {
  readonly publicationStatuses: readonly SelectOption<PublicationStatus>[];
  readonly ctaTypes: readonly SelectOption<ServiceCtaType>[];
  readonly skillOptions: readonly ServiceReference[];
}

export interface ServiceTranslation {
  readonly languageCode: 'fr' | 'en';
  readonly title: string;
  readonly summary: string | null;
  readonly description: string | null;
  readonly problem: string | null;
  readonly targetAudience: string | null;
  readonly ctaLabel: string | null;
}

export interface ServiceItemTranslation {
  readonly languageCode: 'fr' | 'en';
  readonly label: string;
  readonly description: string | null;
}

export interface ServiceBenefit {
  readonly id: string | null;
  readonly active: boolean;
  readonly displayOrder: number;
  readonly translations: readonly ServiceItemTranslation[];
}

export interface ServiceDeliverable {
  readonly id: string | null;
  readonly active: boolean;
  readonly displayOrder: number;
  readonly translations: readonly ServiceItemTranslation[];
}

export interface ServiceAdminSummary {
  readonly id: string;
  readonly slug: string | null;
  readonly title: string;
  readonly publicationStatus: PublicationStatus;
  readonly featured: boolean;
  readonly displayOrder: number;
  readonly icon: string | null;
  readonly ctaType: ServiceCtaType | null;
  readonly updatedAt: string;
  readonly technologies: readonly ServiceReference[];
  readonly skills: readonly ServiceReference[];
}

export interface ServiceAdminDetail extends ServiceAdminSummary {
  readonly visualUrl: string | null;
  readonly ctaTarget: string | null;
  readonly createdAt: string;
  readonly translations: readonly ServiceTranslation[];
  readonly benefits: readonly ServiceBenefit[];
  readonly deliverables: readonly ServiceDeliverable[];
}

export interface ServicePayload {
  readonly slug: string | null;
  readonly featured: boolean;
  readonly displayOrder: number;
  readonly icon: string | null;
  readonly visualUrl: string | null;
  readonly ctaType: ServiceCtaType | null;
  readonly ctaTarget: string | null;
  readonly translations: readonly ServiceTranslation[];
  readonly benefits: readonly ServiceBenefit[];
  readonly deliverables: readonly ServiceDeliverable[];
  readonly technologyIds: readonly string[];
  readonly skillIds: readonly string[];
}

export interface WorkProcessStepTranslation {
  readonly languageCode: 'fr' | 'en';
  readonly title: string;
  readonly description: string | null;
  readonly expectedResult: string | null;
}

export interface WorkProcessStep {
  readonly id: string;
  readonly publicationStatus: PublicationStatus;
  readonly displayOrder: number;
  readonly icon: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly translations: readonly WorkProcessStepTranslation[];
}

export interface WorkProcessStepPayload {
  readonly displayOrder: number;
  readonly icon: string | null;
  readonly translations: readonly WorkProcessStepTranslation[];
}

export interface PublicServiceItem {
  readonly label: string;
  readonly description: string | null;
  readonly displayOrder: number;
}

export interface PublicService {
  readonly slug: string | null;
  readonly title: string;
  readonly summary: string | null;
  readonly description: string | null;
  readonly problem: string | null;
  readonly targetAudience: string | null;
  readonly icon: string | null;
  readonly visualUrl: string | null;
  readonly featured: boolean;
  readonly displayOrder: number;
  readonly ctaType: ServiceCtaType | null;
  readonly ctaTarget: string | null;
  readonly ctaLabel: string | null;
  readonly benefits: readonly PublicServiceItem[];
  readonly deliverables: readonly PublicServiceItem[];
  readonly technologies: readonly ServiceReference[];
  readonly skills: readonly ServiceReference[];
}

export interface PublicWorkProcessStep {
  readonly title: string;
  readonly description: string | null;
  readonly expectedResult: string | null;
  readonly displayOrder: number;
  readonly icon: string | null;
}
