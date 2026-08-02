import { PublicationStatus } from '../../../profile/models/dto/profile.dto';
import { SelectOption } from '../../../../shared/models/select-option.model';

export type ProjectType =
  | 'SAAS_APPLICATION'
  | 'BUSINESS_PLATFORM'
  | 'BACKEND_API'
  | 'DASHBOARD'
  | 'EDUCATIONAL_PLATFORM'
  | 'DOCUMENTATION_SYSTEM'
  | 'DEVOPS_PROJECT'
  | 'PROTOTYPE'
  | 'TECHNICAL_AUDIT'
  | 'DESIGN_STUDY'
  | 'OTHER';

export type ProjectRealStatus = 'IN_PROGRESS' | 'COMPLETED' | 'MAINTAINED' | 'PROTOTYPE' | 'SUSPENDED';

export type ProjectConfidentiality = 'PUBLIC' | 'ANONYMIZED' | 'PRIVATE';

export type ProjectMediaKind = 'COVER' | 'GALLERY';

export interface ProjectMetadata {
  readonly publicationStatuses: SelectOption<PublicationStatus>[];
  readonly projectTypes: SelectOption<ProjectType>[];
  readonly realStatuses: SelectOption<ProjectRealStatus>[];
  readonly confidentialityLevels: SelectOption<ProjectConfidentiality>[];
}

export interface ProjectTranslation {
  readonly languageCode: 'fr' | 'en';
  readonly title: string | null;
  readonly summary: string | null;
  readonly description: string | null;
  readonly context: string | null;
  readonly problem: string | null;
  readonly objectives: string | null;
  readonly targetUsers: string | null;
  readonly role: string | null;
  readonly responsibilities: string | null;
  readonly solution: string | null;
  readonly architectureNotes: string | null;
  readonly features: string | null;
  readonly challenges: string | null;
  readonly decisions: string | null;
  readonly results: string | null;
  readonly seoTitle: string | null;
  readonly seoDescription: string | null;
}

export interface ProjectSkillReference {
  readonly id: string;
  readonly name: string;
  readonly categoryName: string;
}

export interface ProjectLink {
  readonly id: string | null;
  readonly label: string;
  readonly url: string;
  readonly displayOrder: number;
}

export interface ProjectMedia {
  readonly id: string;
  readonly kind: ProjectMediaKind;
  readonly url: string;
  readonly altText: string | null;
  readonly caption: string | null;
  readonly displayOrder: number;
  readonly originalFilename: string;
  readonly sizeBytes: number;
}

export interface Project {
  readonly id: string;
  readonly slug: string;
  readonly projectType: ProjectType;
  readonly realStatus: ProjectRealStatus;
  readonly publicationStatus: PublicationStatus;
  readonly confidentiality: ProjectConfidentiality;
  readonly startDate: string | null;
  readonly endDate: string | null;
  readonly ongoing: boolean;
  readonly featured: boolean;
  readonly displayOrder: number;
  readonly demoUrl: string | null;
  readonly githubUrl: string | null;
  readonly indexable: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly translations: readonly ProjectTranslation[];
  readonly skills: readonly ProjectSkillReference[];
  readonly links: readonly ProjectLink[];
  readonly media: readonly ProjectMedia[];
}

export interface ProjectLinkPayload {
  readonly label: string;
  readonly url: string;
  readonly displayOrder: number;
}

export interface ProjectTranslationPayload {
  readonly languageCode: 'fr' | 'en';
  readonly title: string | null;
  readonly summary: string | null;
  readonly description: string | null;
  readonly context: string | null;
  readonly problem: string | null;
  readonly objectives: string | null;
  readonly targetUsers: string | null;
  readonly role: string | null;
  readonly responsibilities: string | null;
  readonly solution: string | null;
  readonly architectureNotes: string | null;
  readonly features: string | null;
  readonly challenges: string | null;
  readonly decisions: string | null;
  readonly results: string | null;
  readonly seoTitle: string | null;
  readonly seoDescription: string | null;
}

export interface ProjectPayload {
  readonly slug: string;
  readonly projectType: ProjectType;
  readonly realStatus: ProjectRealStatus;
  readonly publicationStatus: PublicationStatus;
  readonly confidentiality: ProjectConfidentiality;
  readonly startDate: string | null;
  readonly endDate: string | null;
  readonly ongoing: boolean;
  readonly featured: boolean;
  readonly displayOrder: number;
  readonly demoUrl: string | null;
  readonly githubUrl: string | null;
  readonly indexable: boolean;
  readonly translations: readonly ProjectTranslationPayload[];
  readonly skillIds: readonly string[];
  readonly links: readonly ProjectLinkPayload[];
}

export interface PublicProjectSummary {
  readonly slug: string;
  readonly projectType: ProjectType;
  readonly realStatus: ProjectRealStatus;
  readonly title: string;
  readonly summary: string | null;
  readonly coverUrl: string | null;
  readonly startDate: string | null;
  readonly endDate: string | null;
  readonly ongoing: boolean;
  readonly featured: boolean;
  readonly skills: readonly ProjectSkillReference[];
}

export interface PublicProject {
  readonly slug: string;
  readonly projectType: ProjectType;
  readonly realStatus: ProjectRealStatus;
  readonly startDate: string | null;
  readonly endDate: string | null;
  readonly ongoing: boolean;
  readonly title: string;
  readonly summary: string | null;
  readonly description: string | null;
  readonly context: string | null;
  readonly problem: string | null;
  readonly objectives: string | null;
  readonly targetUsers: string | null;
  readonly role: string | null;
  readonly responsibilities: string | null;
  readonly solution: string | null;
  readonly architectureNotes: string | null;
  readonly features: string | null;
  readonly challenges: string | null;
  readonly decisions: string | null;
  readonly results: string | null;
  readonly seoTitle: string | null;
  readonly seoDescription: string | null;
  readonly coverUrl: string | null;
  readonly gallery: readonly ProjectMedia[];
  readonly skills: readonly ProjectSkillReference[];
  readonly links: readonly ProjectLink[];
  readonly demoUrl: string | null;
  readonly githubUrl: string | null;
  readonly similarProjects: readonly PublicProjectSummary[];
}
