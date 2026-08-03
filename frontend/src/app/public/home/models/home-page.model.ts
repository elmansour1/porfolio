import { PublicCareer } from '../../../admin/career/models/dto/career.dto';
import { PublicPortfolio } from '../../../admin/profile/models/dto/profile.dto';
import { PublicProjectSummary } from '../../../admin/projects/models/dto/project.dto';
import { PublicService, PublicWorkProcessStep } from '../../../admin/services/models/dto/service.dto';
import { PublicSkills, SkillLevel } from '../../../admin/skills/models/dto/skills.dto';

export type PublicLanguage = 'fr' | 'en';

export type HomeSectionKey =
  | 'HERO'
  | 'ABOUT'
  | 'SKILLS'
  | 'EXPERIENCES'
  | 'EDUCATION'
  | 'PROJECTS'
  | 'SERVICES'
  | 'METHOD'
  | 'TESTIMONIALS'
  | 'CONTACT';

export type HomeSectionError = 'portfolio' | 'skills' | 'career' | 'projects' | 'services' | 'method';

export interface HomePageData {
  readonly language: PublicLanguage;
  readonly portfolio: PublicPortfolio | null;
  readonly skills: PublicSkills | null;
  readonly career: PublicCareer | null;
  readonly featuredProjects: readonly PublicProjectSummary[];
  readonly services: readonly PublicService[];
  readonly workProcessSteps: readonly PublicWorkProcessStep[];
  readonly errors: readonly HomeSectionError[];
}

export interface HomeNavigationItem {
  readonly fragment: string;
  readonly label: string;
}

export interface HomeCopy {
  readonly navProjects: string;
  readonly navContact: string;
  readonly primaryNavigation: string;
  readonly secondaryNavigation: string;
  readonly professionalIndicators: string;
  readonly professionalPortrait: string;
  readonly menuOpen: string;
  readonly menuClose: string;
  readonly languageLabel: string;
  readonly skipToContent: string;
  readonly unavailableTitle: string;
  readonly unavailableMessage: string;
  readonly partialError: string;
  readonly loading: string;
  readonly viewProjects: string;
  readonly contact: string;
  readonly downloadResume: string;
  readonly aboutEyebrow: string;
  readonly skillsEyebrow: string;
  readonly skillsTitle: string;
  readonly featuredSkills: string;
  readonly projectsEyebrow: string;
  readonly projectsTitle: string;
  readonly projectsLink: string;
  readonly careerEyebrow: string;
  readonly careerTitle: string;
  readonly educationTitle: string;
  readonly certificationsTitle: string;
  readonly present: string;
  readonly notSpecified: string;
  readonly noExpiry: string;
  readonly verify: string;
  readonly servicesEyebrow: string;
  readonly servicesTitle: string;
  readonly serviceBenefits: string;
  readonly serviceDeliverables: string;
  readonly methodEyebrow: string;
  readonly methodTitle: string;
  readonly expectedResult: string;
  readonly collaborationEyebrow: string;
  readonly collaborationTitle: string;
  readonly collaborationText: string;
  readonly emailLabel: string;
  readonly phoneLabel: string;
  readonly socialLinks: string;
  readonly footerAdmin: string;
  readonly defaultSiteName: string;
  readonly defaultMonogram: string;
}

export const HOME_COPY: Record<PublicLanguage, HomeCopy> = {
  fr: {
    navProjects: 'Projets',
    navContact: 'Contact',
    primaryNavigation: 'Navigation principale',
    secondaryNavigation: 'Navigation secondaire',
    professionalIndicators: 'Indicateurs professionnels',
    professionalPortrait: 'Portrait professionnel',
    menuOpen: 'Ouvrir le menu',
    menuClose: 'Fermer le menu',
    languageLabel: 'Langue',
    skipToContent: 'Aller au contenu principal',
    unavailableTitle: 'Portfolio en cours de préparation',
    unavailableMessage:
      'Le profil public principal n’est pas encore publié. Les sections publiées restent accessibles lorsqu’elles sont disponibles.',
    partialError:
      'Une section n’a pas pu être chargée. Le reste du portfolio reste consultable.',
    loading: 'Chargement du portfolio public',
    viewProjects: 'Voir les projets',
    contact: 'Entrer en contact',
    downloadResume: 'Télécharger le CV',
    aboutEyebrow: 'À propos',
    skillsEyebrow: 'Compétences',
    skillsTitle: 'Compétences structurées',
    featuredSkills: 'Compétences principales',
    projectsEyebrow: 'Réalisations',
    projectsTitle: 'Projets mis en avant',
    projectsLink: 'Voir tous les projets',
    careerEyebrow: 'Parcours',
    careerTitle: 'Expériences, formations et certifications',
    educationTitle: 'Formations',
    certificationsTitle: 'Certifications',
    present: 'En cours',
    notSpecified: 'Non renseigné',
    noExpiry: 'Sans expiration',
    verify: 'Vérifier',
    servicesEyebrow: 'Services',
    servicesTitle: 'Services professionnels',
    serviceBenefits: 'Bénéfices',
    serviceDeliverables: 'Livrables possibles',
    methodEyebrow: 'Méthode',
    methodTitle: 'Méthode de travail',
    expectedResult: 'Résultat attendu',
    collaborationEyebrow: 'Collaboration',
    collaborationTitle: 'Construire un projet clair, utile et maintenable',
    collaborationText:
      'Un échange permet de cadrer le besoin, le niveau de maturité technique et les prochaines étapes réalistes.',
    emailLabel: 'E-mail',
    phoneLabel: 'Téléphone',
    socialLinks: 'Liens professionnels',
    footerAdmin: 'Administration',
    defaultSiteName: 'Portfolio professionnel',
    defaultMonogram: 'FE',
  },
  en: {
    navProjects: 'Projects',
    navContact: 'Contact',
    primaryNavigation: 'Primary navigation',
    secondaryNavigation: 'Secondary navigation',
    professionalIndicators: 'Professional indicators',
    professionalPortrait: 'Professional portrait',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    languageLabel: 'Language',
    skipToContent: 'Skip to main content',
    unavailableTitle: 'Portfolio being prepared',
    unavailableMessage:
      'The main public profile is not published yet. Published sections remain available when data exists.',
    partialError:
      'One section could not be loaded. The rest of the portfolio remains available.',
    loading: 'Loading public portfolio',
    viewProjects: 'View projects',
    contact: 'Get in touch',
    downloadResume: 'Download resume',
    aboutEyebrow: 'About',
    skillsEyebrow: 'Skills',
    skillsTitle: 'Structured skills',
    featuredSkills: 'Featured skills',
    projectsEyebrow: 'Selected work',
    projectsTitle: 'Featured projects',
    projectsLink: 'View all projects',
    careerEyebrow: 'Career',
    careerTitle: 'Experience, education and certifications',
    educationTitle: 'Education',
    certificationsTitle: 'Certifications',
    present: 'Present',
    notSpecified: 'Not specified',
    noExpiry: 'No expiry',
    verify: 'Verify',
    servicesEyebrow: 'Services',
    servicesTitle: 'Professional services',
    serviceBenefits: 'Benefits',
    serviceDeliverables: 'Possible deliverables',
    methodEyebrow: 'Method',
    methodTitle: 'Working method',
    expectedResult: 'Expected result',
    collaborationEyebrow: 'Collaboration',
    collaborationTitle: 'Build a clear, useful and maintainable project',
    collaborationText:
      'A first discussion helps frame the need, the technical maturity level and realistic next steps.',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    socialLinks: 'Professional links',
    footerAdmin: 'Administration',
    defaultSiteName: 'Professional portfolio',
    defaultMonogram: 'FE',
  },
};

export const SKILL_LEVEL_LABELS: Record<
  SkillLevel,
  Record<PublicLanguage, string>
> = {
  NOTIONS: { fr: 'Notions', en: 'Foundational' },
  OPERATIONAL: { fr: 'Opérationnel', en: 'Operational' },
  ADVANCED: { fr: 'Avancé', en: 'Advanced' },
  CORE_EXPERTISE: { fr: 'Expertise principale', en: 'Core expertise' },
};
