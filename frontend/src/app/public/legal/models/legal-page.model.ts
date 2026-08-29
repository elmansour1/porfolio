import { PublicLanguage } from '../../home/models/home-page.model';

export interface LegalPageSection {
  readonly heading: string;
  readonly body: readonly string[];
}

export interface LegalChromeCopy {
  readonly siteName: string;
  readonly skipToContent: string;
  readonly navHome: string;
  readonly navProjects: string;
  readonly navContact: string;
  readonly languageLabel: string;
}

export const LEGAL_CHROME_COPY: Record<PublicLanguage, LegalChromeCopy> = {
  fr: {
    siteName: 'Portfolio professionnel',
    skipToContent: 'Aller au contenu principal',
    navHome: 'Accueil',
    navProjects: 'Projets',
    navContact: 'Contact',
    languageLabel: 'Langue',
  },
  en: {
    siteName: 'Professional portfolio',
    skipToContent: 'Skip to main content',
    navHome: 'Home',
    navProjects: 'Projects',
    navContact: 'Contact',
    languageLabel: 'Language',
  },
};

export { type PublicLanguage };
