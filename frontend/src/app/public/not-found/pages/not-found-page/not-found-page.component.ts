import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { LEGAL_CHROME_COPY, PublicLanguage } from '../../../legal/models/legal-page.model';

interface NotFoundCopy {
  readonly title: string;
  readonly message: string;
  readonly homeLink: string;
  readonly projectsLink: string;
  readonly contactLink: string;
}

const NOT_FOUND_COPY: Record<PublicLanguage, NotFoundCopy> = {
  fr: {
    title: 'Page introuvable',
    message: 'La page demandée n’existe pas ou a été déplacée. Vous pouvez reprendre votre navigation ci-dessous.',
    homeLink: 'Retour à l’accueil',
    projectsLink: 'Voir les projets',
    contactLink: 'Contacter',
  },
  en: {
    title: 'Page not found',
    message: 'The requested page does not exist or has been moved. You can resume browsing below.',
    homeLink: 'Back to home',
    projectsLink: 'View projects',
    contactLink: 'Contact',
  },
};

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="not-found-page">
      <div class="legal-page__languages" [attr.aria-label]="chrome().languageLabel">
        <button
          type="button"
          [attr.aria-pressed]="language() === 'fr'"
          [class.legal-page__language--active]="language() === 'fr'"
          (click)="language.set('fr')"
        >
          FR
        </button>
        <button
          type="button"
          [attr.aria-pressed]="language() === 'en'"
          [class.legal-page__language--active]="language() === 'en'"
          (click)="language.set('en')"
        >
          EN
        </button>
      </div>

      <p class="not-found-page__code" aria-hidden="true">404</p>
      <h1>{{ copy().title }}</h1>
      <p>{{ copy().message }}</p>

      <div class="not-found-page__actions">
        <a class="home-button home-button--primary" routerLink="/">{{ copy().homeLink }}</a>
        <a class="home-button" routerLink="/projects">{{ copy().projectsLink }}</a>
        <a class="home-button" routerLink="/" fragment="contact">{{ copy().contactLink }}</a>
      </div>
    </div>
  `,
})
export class NotFoundPageComponent {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  readonly language = signal<PublicLanguage>('fr');
  readonly copy = computed(() => NOT_FOUND_COPY[this.language()]);

  constructor() {
    this.title.setTitle(this.copy().title);
    this.meta.updateTag({ name: 'description', content: this.copy().message });
  }

  chrome() {
    return LEGAL_CHROME_COPY[this.language()];
  }
}
