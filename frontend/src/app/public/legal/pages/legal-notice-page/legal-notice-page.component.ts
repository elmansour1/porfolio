import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { LegalPageShellComponent } from '../../components/legal-page-shell/legal-page-shell.component';
import { LegalPageSection, PublicLanguage } from '../../models/legal-page.model';

interface LegalNoticeCopy {
  readonly title: string;
  readonly intro: string;
  readonly sections: readonly LegalPageSection[];
  readonly reserveNotice: string;
}

const LEGAL_NOTICE_COPY: Record<PublicLanguage, LegalNoticeCopy> = {
  fr: {
    title: 'Mentions légales',
    intro:
      'Les informations légales définitives (raison sociale, hébergeur, responsable de publication) doivent être complétées par l’éditeur du site avant la mise en ligne.',
    sections: [
      {
        heading: 'Éditeur du site',
        body: [
          '[Réserve — à compléter avant mise en ligne] Raison sociale, forme juridique, adresse et coordonnées de l’éditeur du site.',
        ],
      },
      {
        heading: 'Responsable de publication',
        body: ['[Réserve — à compléter avant mise en ligne] Nom du responsable de la publication du site.'],
      },
      {
        heading: 'Hébergement',
        body: [
          '[Réserve — à compléter avant mise en ligne] Raison sociale, adresse et coordonnées de l’hébergeur du site.',
        ],
      },
      {
        heading: 'Contact',
        body: [
          'Pour toute question relative à ces mentions légales, vous pouvez utiliser le formulaire de contact accessible depuis la page d’accueil.',
        ],
      },
    ],
    reserveNotice:
      'Cette page contient des réserves explicites à compléter par l’éditeur du site avant la mise en ligne définitive.',
  },
  en: {
    title: 'Legal notice',
    intro:
      'The final legal information (company name, hosting provider, publication manager) must be completed by the site owner before going live.',
    sections: [
      {
        heading: 'Site publisher',
        body: [
          '[Reserve — to be completed before release] Company name, legal form, address and contact details of the site publisher.',
        ],
      },
      {
        heading: 'Publication manager',
        body: ['[Reserve — to be completed before release] Name of the person responsible for the site publication.'],
      },
      {
        heading: 'Hosting',
        body: [
          '[Reserve — to be completed before release] Company name, address and contact details of the site hosting provider.',
        ],
      },
      {
        heading: 'Contact',
        body: [
          'For any question regarding this legal notice, you can use the contact form available from the home page.',
        ],
      },
    ],
    reserveNotice: 'This page contains explicit placeholders to be completed by the site owner before final release.',
  },
};

@Component({
  selector: 'app-legal-notice-page',
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
export class LegalNoticePageComponent {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  readonly language = signal<PublicLanguage>('fr');
  readonly copy = computed(() => LEGAL_NOTICE_COPY[this.language()]);

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
