import { ProjectRealStatus, ProjectType } from '../../admin/projects/models/dto/project.dto';

const PROJECT_TYPE_LABELS: Record<ProjectType, { readonly fr: string; readonly en: string }> = {
  SAAS_APPLICATION: { fr: 'Application SaaS', en: 'SaaS application' },
  BUSINESS_PLATFORM: { fr: 'Plateforme métier', en: 'Business platform' },
  BACKEND_API: { fr: 'API backend', en: 'Backend API' },
  DASHBOARD: { fr: 'Tableau de bord', en: 'Dashboard' },
  EDUCATIONAL_PLATFORM: { fr: 'Plateforme éducative', en: 'Educational platform' },
  DOCUMENTATION_SYSTEM: { fr: 'Système de documentation', en: 'Documentation system' },
  DEVOPS_PROJECT: { fr: 'Projet DevOps', en: 'DevOps project' },
  PROTOTYPE: { fr: 'Prototype', en: 'Prototype' },
  TECHNICAL_AUDIT: { fr: 'Audit technique', en: 'Technical audit' },
  DESIGN_STUDY: { fr: 'Étude de design', en: 'Design study' },
  OTHER: { fr: 'Autre', en: 'Other' },
};

const PROJECT_REAL_STATUS_LABELS: Record<
  ProjectRealStatus,
  { readonly fr: string; readonly en: string }
> = {
  IN_PROGRESS: { fr: 'En cours', en: 'In progress' },
  COMPLETED: { fr: 'Terminé', en: 'Completed' },
  MAINTAINED: { fr: 'Maintenu', en: 'Maintained' },
  PROTOTYPE: { fr: 'Prototype', en: 'Prototype' },
  SUSPENDED: { fr: 'Suspendu', en: 'Suspended' },
};

export function projectTypeLabel(type: ProjectType, language: 'fr' | 'en'): string {
  return PROJECT_TYPE_LABELS[type]?.[language] ?? type;
}

export function projectRealStatusLabel(status: ProjectRealStatus, language: 'fr' | 'en'): string {
  return PROJECT_REAL_STATUS_LABELS[status]?.[language] ?? status;
}

export function projectPeriodLabel(
  startDate: string | null,
  endDate: string | null,
  ongoing: boolean,
  language: 'fr' | 'en',
): string {
  const currentLabel = language === 'en' ? 'Present' : 'En cours';
  const missingLabel = language === 'en' ? 'Not specified' : 'Non renseigné';
  const start = startDate ?? missingLabel;
  return `${start} - ${ongoing ? currentLabel : (endDate ?? missingLabel)}`;
}
