import { PublicLanguage } from '../../home/models/home-page.model';

export type ContactRequestType = 'GENERAL' | 'PROJECT' | 'JOB' | 'PARTNERSHIP' | 'OTHER';

export interface ContactFormPayload {
  readonly name: string;
  readonly email: string;
  readonly company: string | null;
  readonly requestType: ContactRequestType;
  readonly subject: string;
  readonly message: string;
  readonly consent: boolean;
  readonly website: string;
}

export const CONTACT_REQUEST_TYPES: readonly ContactRequestType[] = [
  'GENERAL',
  'PROJECT',
  'JOB',
  'PARTNERSHIP',
  'OTHER',
];

export const CONTACT_REQUEST_TYPE_LABELS: Record<ContactRequestType, Record<PublicLanguage, string>> = {
  GENERAL: { fr: 'Question générale', en: 'General question' },
  PROJECT: { fr: 'Projet à discuter', en: 'Project to discuss' },
  JOB: { fr: 'Opportunité professionnelle', en: 'Job opportunity' },
  PARTNERSHIP: { fr: 'Partenariat', en: 'Partnership' },
  OTHER: { fr: 'Autre', en: 'Other' },
};
