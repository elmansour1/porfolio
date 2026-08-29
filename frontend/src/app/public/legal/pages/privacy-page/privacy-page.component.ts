import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { LegalPageShellComponent } from '../../components/legal-page-shell/legal-page-shell.component';
import { LegalPageSection, PublicLanguage } from '../../models/legal-page.model';

interface PrivacyCopy {
  readonly title: string;
  readonly intro: string;
  readonly sections: readonly LegalPageSection[];
  readonly reserveNotice: string;
}

const PRIVACY_COPY: Record<PublicLanguage, PrivacyCopy> = {
  fr: {
    title: 'Politique de confidentialité',
    intro:
      'Cette page explique quelles données sont collectées via ce site, dans quel but et pendant combien de temps, notamment lors de l’utilisation du formulaire de contact.',
    sections: [
      {
        heading: 'Données collectées',
        body: [
          'Lorsque le formulaire de contact est utilisé, les données suivantes sont collectées : nom, adresse e-mail, entreprise (facultatif), type de demande, sujet, message, ainsi que l’adresse IP et l’agent utilisateur du navigateur à des fins de sécurité (limitation des abus).',
          'Aucune autre donnée personnelle n’est collectée en dehors de la navigation strictement nécessaire au fonctionnement technique du site.',
        ],
      },
      {
        heading: 'Finalité',
        body: [
          'Les données transmises via le formulaire de contact sont utilisées exclusivement pour répondre à la demande formulée et assurer la sécurité du service (prévention des abus et des soumissions automatisées).',
        ],
      },
      {
        heading: 'Durée de conservation',
        body: [
          '[Réserve — à compléter avant mise en ligne] La durée précise de conservation des messages de contact doit être définie par l’éditeur du site en fonction de sa politique interne et du cadre légal applicable.',
        ],
      },
      {
        heading: 'Contact',
        body: [
          'Pour toute question relative à cette politique de confidentialité ou pour exercer vos droits, vous pouvez utiliser le formulaire de contact accessible depuis la page d’accueil.',
        ],
      },
      {
        heading: 'Cookies et mesure d’audience',
        body: [
          'Ce site n’utilise pas de cookies de mesure d’audience ni de traceurs publicitaires tiers à ce jour.',
        ],
      },
      {
        heading: 'Droits des utilisateurs',
        body: [
          '[Réserve — à compléter avant mise en ligne] Les droits applicables (accès, rectification, effacement, opposition) dépendent du cadre légal retenu par l’éditeur du site et seront précisés avant la mise en production définitive.',
        ],
      },
    ],
    reserveNotice:
      'Certaines informations de cette page sont des réserves à compléter par l’éditeur du site avant la mise en ligne définitive.',
  },
  en: {
    title: 'Privacy policy',
    intro:
      'This page explains what data is collected through this website, for what purpose and for how long, in particular when using the contact form.',
    sections: [
      {
        heading: 'Data collected',
        body: [
          'When the contact form is used, the following data is collected: name, email address, company (optional), request type, subject, message, as well as the IP address and browser user agent for security purposes (abuse prevention).',
          'No other personal data is collected beyond the browsing information strictly necessary for the technical operation of the site.',
        ],
      },
      {
        heading: 'Purpose',
        body: [
          'Data submitted through the contact form is used exclusively to respond to the request made and to ensure the security of the service (prevention of abuse and automated submissions).',
        ],
      },
      {
        heading: 'Retention period',
        body: [
          '[Reserve — to be completed before release] The exact retention period for contact messages must be defined by the site owner based on their internal policy and applicable legal framework.',
        ],
      },
      {
        heading: 'Contact',
        body: [
          'For any question regarding this privacy policy or to exercise your rights, you can use the contact form available from the home page.',
        ],
      },
      {
        heading: 'Cookies and audience measurement',
        body: [
          'This site does not currently use audience measurement cookies or third-party advertising trackers.',
        ],
      },
      {
        heading: 'User rights',
        body: [
          '[Reserve — to be completed before release] Applicable rights (access, rectification, erasure, objection) depend on the legal framework chosen by the site owner and will be specified before final production deployment.',
        ],
      },
    ],
    reserveNotice:
      'Some information on this page is a placeholder to be completed by the site owner before final release.',
  },
};

@Component({
  selector: 'app-privacy-page',
  imports: [LegalPageShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-legal-page-shell [language]="language()" (languageChange)="changeLanguage($event)">
      <article class="legal-page__article">
        <h1>{{ copy().title }}</h1>
        <p class="legal-page__intro">{{ copy().intro }}</p>

        @for (section of copy().sections; track section.heading) {
          <section>
            <h2>{{ section.heading }}</h2>
            @for (paragraph of section.body; track paragraph) {
              <p>{{ paragraph }}</p>
            }
          </section>
        }

        <p class="legal-page__reserve" role="note">{{ copy().reserveNotice }}</p>
      </article>
    </app-legal-page-shell>
  `,
})
export class PrivacyPageComponent {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  readonly language = signal<PublicLanguage>('fr');
  readonly copy = computed(() => PRIVACY_COPY[this.language()]);

  constructor() {
    this.updateSeo();
  }

  changeLanguage(language: PublicLanguage): void {
    this.language.set(language);
    this.updateSeo();
  }

  private updateSeo(): void {
    this.title.setTitle(this.copy().title);
    this.meta.updateTag({ name: 'description', content: this.copy().intro });
  }
}
