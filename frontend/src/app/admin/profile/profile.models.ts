export type PublicationStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type AvailabilityStatus = 'AVAILABLE' | 'OPEN_TO_OPPORTUNITIES' | 'UNAVAILABLE' | 'HIDDEN';
export type ProfessionalLinkType = 'GITHUB' | 'LINKEDIN' | 'PERSONAL_SITE' | 'EMAIL' | 'OTHER';

export interface ProfileMedia {
  readonly id: string;
  readonly fileName: string;
  readonly contentType: string;
  readonly sizeBytes: number;
  readonly altText: string | null;
  readonly url: string;
}

export interface ProfileTranslation {
  readonly languageCode: 'fr' | 'en';
  readonly professionalTitle: string | null;
  readonly tagline: string | null;
  readonly shortSummary: string | null;
  readonly biography: string | null;
  readonly aboutText: string | null;
  readonly availabilityLabel: string | null;
  readonly primaryCtaLabel: string | null;
  readonly primaryCtaUrl: string | null;
  readonly secondaryCtaLabel: string | null;
  readonly secondaryCtaUrl: string | null;
  readonly footerText: string | null;
}

export interface ProfessionalLink {
  readonly id?: string;
  readonly type: ProfessionalLinkType;
  readonly label: string;
  readonly url: string;
  readonly icon: string | null;
  readonly displayOrder: number;
  readonly visible: boolean;
  readonly openInNewTab: boolean;
}

export interface ProfessionalStatistic {
  readonly id?: string;
  readonly value: string;
  readonly labelFr: string;
  readonly labelEn: string;
  readonly displayOrder: number;
  readonly visible: boolean;
}

export interface AdminProfile {
  readonly id: string;
  readonly publicationStatus: PublicationStatus;
  readonly firstName: string;
  readonly lastName: string;
  readonly displayName: string;
  readonly location: string | null;
  readonly country: string | null;
  readonly availabilityStatus: AvailabilityStatus;
  readonly professionalEmail: string | null;
  readonly phone: string | null;
  readonly showEmail: boolean;
  readonly showPhone: boolean;
  readonly showPhoto: boolean;
  readonly showCv: boolean;
  readonly showLinks: boolean;
  readonly showStatistics: boolean;
  readonly photo: ProfileMedia | null;
  readonly cv: ProfileMedia | null;
  readonly translations: readonly ProfileTranslation[];
  readonly links: readonly ProfessionalLink[];
  readonly statistics: readonly ProfessionalStatistic[];
}

export interface SectionSetting {
  readonly sectionKey: string;
  readonly label: string;
  readonly displayOrder: number;
  readonly visible: boolean;
}

export interface AdminSiteSettings {
  readonly id: string;
  readonly publicSiteName: string;
  readonly monogram: string;
  readonly defaultLanguage: 'fr' | 'en';
  readonly activeLanguages: readonly ('fr' | 'en')[];
  readonly contactRecipientEmail: string | null;
  readonly footerCopyright: string | null;
  readonly showCvDownload: boolean;
  readonly showContactDetails: boolean;
  readonly showSocialLinks: boolean;
  readonly maintenanceMode: boolean;
  readonly logo: ProfileMedia | null;
  readonly favicon: ProfileMedia | null;
  readonly sections: readonly SectionSetting[];
}

export interface PublicPortfolio {
  readonly profilePublished: boolean;
  readonly language: 'fr' | 'en';
  readonly settings: {
    readonly publicSiteName: string;
    readonly monogram: string;
    readonly defaultLanguage: 'fr' | 'en';
    readonly activeLanguages: readonly ('fr' | 'en')[];
    readonly footerCopyright: string | null;
    readonly maintenanceMode: boolean;
    readonly logoUrl: string | null;
    readonly faviconUrl: string | null;
  };
  readonly profile: {
    readonly displayName: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly location: string | null;
    readonly country: string | null;
    readonly availabilityStatus: AvailabilityStatus;
    readonly availabilityLabel: string | null;
    readonly professionalTitle: string | null;
    readonly tagline: string | null;
    readonly shortSummary: string | null;
    readonly biography: string | null;
    readonly aboutText: string | null;
    readonly professionalEmail: string | null;
    readonly phone: string | null;
    readonly photoUrl: string | null;
    readonly photoAltText: string | null;
    readonly cvUrl: string | null;
    readonly primaryCtaLabel: string | null;
    readonly primaryCtaUrl: string | null;
    readonly secondaryCtaLabel: string | null;
    readonly secondaryCtaUrl: string | null;
    readonly footerText: string | null;
    readonly links: readonly {
      readonly type: string;
      readonly label: string;
      readonly url: string;
      readonly icon: string | null;
      readonly openInNewTab: boolean;
    }[];
    readonly statistics: readonly {
      readonly value: string;
      readonly label: string;
    }[];
  } | null;
  readonly sections: readonly SectionSetting[];
}
