import { Project, ProjectLink, ProjectLinkPayload, ProjectPayload } from '../models/dto/project.dto';
import { ProjectForm } from '../models/forms/project-form.model';

export function projectFormValue(project: Project | null, fallbackOrder: number) {
  const fr = project?.translations.find((translation) => translation.languageCode === 'fr');
  const en = project?.translations.find((translation) => translation.languageCode === 'en');
  return {
    id: project?.id ?? null,
    slug: project?.slug ?? '',
    projectType: project?.projectType ?? 'SAAS_APPLICATION',
    realStatus: project?.realStatus ?? 'IN_PROGRESS',
    publicationStatus: project?.publicationStatus ?? 'DRAFT',
    confidentiality: project?.confidentiality ?? 'PUBLIC',
    startDate: parseDate(project?.startDate),
    endDate: parseDate(project?.endDate),
    ongoing: project?.ongoing ?? false,
    featured: project?.featured ?? false,
    displayOrder: project?.displayOrder ?? fallbackOrder,
    demoUrl: project?.demoUrl ?? '',
    githubUrl: project?.githubUrl ?? '',
    indexable: project?.indexable ?? true,
    skillIds: project?.skills.map((skill) => skill.id) ?? [],
    titleFr: fr?.title ?? '',
    summaryFr: fr?.summary ?? '',
    descriptionFr: fr?.description ?? '',
    contextFr: fr?.context ?? '',
    problemFr: fr?.problem ?? '',
    objectivesFr: fr?.objectives ?? '',
    targetUsersFr: fr?.targetUsers ?? '',
    roleFr: fr?.role ?? '',
    responsibilitiesFr: fr?.responsibilities ?? '',
    solutionFr: fr?.solution ?? '',
    architectureNotesFr: fr?.architectureNotes ?? '',
    featuresFr: fr?.features ?? '',
    challengesFr: fr?.challenges ?? '',
    decisionsFr: fr?.decisions ?? '',
    resultsFr: fr?.results ?? '',
    seoTitleFr: fr?.seoTitle ?? '',
    seoDescriptionFr: fr?.seoDescription ?? '',
    titleEn: en?.title ?? '',
    summaryEn: en?.summary ?? '',
    descriptionEn: en?.description ?? '',
    contextEn: en?.context ?? '',
    problemEn: en?.problem ?? '',
    objectivesEn: en?.objectives ?? '',
    targetUsersEn: en?.targetUsers ?? '',
    roleEn: en?.role ?? '',
    responsibilitiesEn: en?.responsibilities ?? '',
    solutionEn: en?.solution ?? '',
    architectureNotesEn: en?.architectureNotes ?? '',
    featuresEn: en?.features ?? '',
    challengesEn: en?.challenges ?? '',
    decisionsEn: en?.decisions ?? '',
    resultsEn: en?.results ?? '',
    seoTitleEn: en?.seoTitle ?? '',
    seoDescriptionEn: en?.seoDescription ?? '',
  };
}

export function projectLinksValue(project: Project | null): ProjectLink[] {
  return project ? [...project.links] : [];
}

export function toProjectPayload(form: ProjectForm, links: readonly ProjectLink[]): ProjectPayload {
  const value = form.getRawValue();
  return {
    slug: value.slug.trim(),
    projectType: value.projectType,
    realStatus: value.realStatus,
    publicationStatus: value.publicationStatus,
    confidentiality: value.confidentiality,
    startDate: toDateString(value.startDate),
    endDate: value.ongoing ? null : toDateString(value.endDate),
    ongoing: value.ongoing,
    featured: value.featured,
    displayOrder: value.displayOrder,
    demoUrl: blankToNull(value.demoUrl),
    githubUrl: blankToNull(value.githubUrl),
    indexable: value.indexable,
    skillIds: value.skillIds,
    translations: [
      {
        languageCode: 'fr',
        title: blankToNull(value.titleFr),
        summary: blankToNull(value.summaryFr),
        description: blankToNull(value.descriptionFr),
        context: blankToNull(value.contextFr),
        problem: blankToNull(value.problemFr),
        objectives: blankToNull(value.objectivesFr),
        targetUsers: blankToNull(value.targetUsersFr),
        role: blankToNull(value.roleFr),
        responsibilities: blankToNull(value.responsibilitiesFr),
        solution: blankToNull(value.solutionFr),
        architectureNotes: blankToNull(value.architectureNotesFr),
        features: blankToNull(value.featuresFr),
        challenges: blankToNull(value.challengesFr),
        decisions: blankToNull(value.decisionsFr),
        results: blankToNull(value.resultsFr),
        seoTitle: blankToNull(value.seoTitleFr),
        seoDescription: blankToNull(value.seoDescriptionFr),
      },
      {
        languageCode: 'en',
        title: blankToNull(value.titleEn),
        summary: blankToNull(value.summaryEn),
        description: blankToNull(value.descriptionEn),
        context: blankToNull(value.contextEn),
        problem: blankToNull(value.problemEn),
        objectives: blankToNull(value.objectivesEn),
        targetUsers: blankToNull(value.targetUsersEn),
        role: blankToNull(value.roleEn),
        responsibilities: blankToNull(value.responsibilitiesEn),
        solution: blankToNull(value.solutionEn),
        architectureNotes: blankToNull(value.architectureNotesEn),
        features: blankToNull(value.featuresEn),
        challenges: blankToNull(value.challengesEn),
        decisions: blankToNull(value.decisionsEn),
        results: blankToNull(value.resultsEn),
        seoTitle: blankToNull(value.seoTitleEn),
        seoDescription: blankToNull(value.seoDescriptionEn),
      },
    ],
    links: links.map((link): ProjectLinkPayload => ({
      label: link.label.trim(),
      url: link.url.trim(),
      displayOrder: link.displayOrder,
    })),
  };
}

function parseDate(value: string | null | undefined): Date | null {
  return value ? new Date(`${value}T00:00:00`) : null;
}

function toDateString(value: Date | null): string | null {
  return dateStringOrNull(value);
}

function dateStringOrNull(value: Date | null): string | null {
  if (!value) {
    return null;
  }
  return value.toISOString().slice(0, 10);
}

function blankToNull(value: string): string | null {
  const normalized = value.trim();
  return normalized.length ? normalized : null;
}
