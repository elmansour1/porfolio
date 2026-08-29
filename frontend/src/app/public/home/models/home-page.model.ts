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
  readonly navCareer: string;
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
  readonly heroScrollHint: string;
  readonly aboutEyebrow: string;
  readonly skillsEyebrow: string;
  readonly skillsTitle: string;
  readonly skillsSubtitle: string;
  readonly coreStackLabel: string;
  readonly featuredSkills: string;
  readonly projectsEyebrow: string;
  readonly projectsTitle: string;
  readonly projectsSubtitle: string;
  readonly projectsLink: string;
  readonly projectCaseStudyLink: string;
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
  readonly navPrivacy: string;
  readonly navLegal: string;
  readonly defaultSiteName: string;
  readonly defaultMonogram: string;
  readonly contactFormTitle: string;
  readonly contactFormIntro: string;
  readonly contactNameLabel: string;
  readonly contactEmailLabel: string;
  readonly contactCompanyLabel: string;
  readonly contactCompanyOptional: string;
  readonly contactRequestTypeLabel: string;
  readonly contactSubjectLabel: string;
  readonly contactMessageLabel: string;
  readonly contactConsentLabel: string;
  readonly contactSubmitLabel: string;
  readonly contactSubmittingLabel: string;
  readonly contactSuccessTitle: string;
  readonly contactSuccessMessage: string;
  readonly contactSendAnother: string;
  readonly contactErrorValidation: string;
  readonly contactErrorNetwork: string;
  readonly contactErrorRateLimited: string;
  readonly contactRequiredField: string;
  readonly contactInvalidEmail: string;
  readonly contactMessageTooShort: string;
}

export const HOME_COPY: Record<PublicLanguage, HomeCopy> = {
  fr: {
    navProjects: 'Projets',
    navCareer: 'Parcours',
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
    heroScrollHint: 'Découvrir le portfolio',
    aboutEyebrow: 'À propos',
    skillsEyebrow: 'Compétences',
    skillsTitle: 'Stack & compétences',
    skillsSubtitle:
      'Technologies regroupées par usage réel — pas une liste exhaustive, mais ce que j’utilise en production.',
    coreStackLabel: 'Stack principale',
    featuredSkills: 'Compétences principales',
    projectsEyebrow: 'Études de cas',
    projectsTitle: 'Projets qui prouvent la capacité à livrer',
    projectsSubtitle:
      'Chaque projet détaille le contexte, le rôle joué et le résultat obtenu — format CASE en page dédiée.',
    projectsLink: 'Voir tous les projets',
    projectCaseStudyLink: 'Lire l’étude de cas',
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
    navPrivacy: 'Confidentialité',
    navLegal: 'Mentions légales',
    defaultSiteName: 'Portfolio professionnel',
    defaultMonogram: 'FE',
    contactFormTitle: 'Envoyer un message',
    contactFormIntro:
      'Décrivez votre besoin en quelques lignes, une réponse suit dès que possible.',
    contactNameLabel: 'Nom',
    contactEmailLabel: 'E-mail',
    contactCompanyLabel: 'Entreprise',
    contactCompanyOptional: 'facultatif',
    contactRequestTypeLabel: 'Type de demande',
    contactSubjectLabel: 'Sujet',
    contactMessageLabel: 'Message',
    contactConsentLabel:
      'J’accepte que ces informations soient utilisées pour répondre à ma demande, conformément à la politique de confidentialité.',
    contactSubmitLabel: 'Envoyer le message',
    contactSubmittingLabel: 'Envoi en cours…',
    contactSuccessTitle: 'Message envoyé',
    contactSuccessMessage:
      'Merci, votre message a bien été transmis. Une réponse sera apportée dès que possible.',
    contactSendAnother: 'Envoyer un autre message',
    contactErrorValidation:
      'Certains champs sont invalides. Vérifiez les informations saisies puis réessayez.',
    contactErrorNetwork:
      'Le message n’a pas pu être envoyé en raison d’un problème réseau. Réessayez dans un instant.',
    contactErrorRateLimited:
      'Trop de messages ont été envoyés récemment depuis cette connexion. Merci de réessayer plus tard.',
    contactRequiredField: 'Ce champ est obligatoire.',
    contactInvalidEmail: 'Adresse e-mail invalide.',
    contactMessageTooShort: 'Le message doit contenir au moins 20 caractères.',
  },
  en: {
    navProjects: 'Projects',
    navCareer: 'Career',
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
    heroScrollHint: 'Explore the portfolio',
    aboutEyebrow: 'About',
    skillsEyebrow: 'Skills',
    skillsTitle: 'Stack & skills',
    skillsSubtitle:
      'Technologies grouped by real-world usage — not an exhaustive list, but what ships in production.',
    coreStackLabel: 'Core stack',
    featuredSkills: 'Featured skills',
    projectsEyebrow: 'Case studies',
    projectsTitle: 'Projects that prove delivery',
    projectsSubtitle:
      'Each project covers context, role and outcome — full CASE format on the detail page.',
    projectsLink: 'View all projects',
    projectCaseStudyLink: 'Read case study',
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
    navPrivacy: 'Privacy',
    navLegal: 'Legal notice',
    defaultSiteName: 'Professional portfolio',
    defaultMonogram: 'FE',
    contactFormTitle: 'Send a message',
    contactFormIntro: 'Describe your need in a few lines, a reply follows as soon as possible.',
    contactNameLabel: 'Name',
    contactEmailLabel: 'Email',
    contactCompanyLabel: 'Company',
    contactCompanyOptional: 'optional',
    contactRequestTypeLabel: 'Request type',
    contactSubjectLabel: 'Subject',
    contactMessageLabel: 'Message',
    contactConsentLabel:
      'I agree that this information is used to answer my request, in line with the privacy policy.',
    contactSubmitLabel: 'Send message',
    contactSubmittingLabel: 'Sending…',
    contactSuccessTitle: 'Message sent',
    contactSuccessMessage: 'Thank you, your message has been sent. A reply will follow as soon as possible.',
    contactSendAnother: 'Send another message',
    contactErrorValidation: 'Some fields are invalid. Check the information entered and try again.',
    contactErrorNetwork: 'The message could not be sent because of a network issue. Please try again shortly.',
    contactErrorRateLimited: 'Too many messages were sent recently from this connection. Please try again later.',
    contactRequiredField: 'This field is required.',
    contactInvalidEmail: 'Invalid email address.',
    contactMessageTooShort: 'The message must contain at least 20 characters.',
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

/** Width percentage for premium skill level bars. */
export const SKILL_LEVEL_PROGRESS: Record<SkillLevel, number> = {
  NOTIONS: 28,
  OPERATIONAL: 52,
  ADVANCED: 76,
  CORE_EXPERTISE: 100,
};
