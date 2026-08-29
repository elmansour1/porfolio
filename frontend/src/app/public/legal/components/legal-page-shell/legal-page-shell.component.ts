import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LEGAL_CHROME_COPY, PublicLanguage } from '../../models/legal-page.model';

@Component({
  selector: 'app-legal-page-shell',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="legal-page">
      <a class="home-skip-link" href="#legal-main-content">{{ chrome().skipToContent }}</a>
      <header class="legal-page__header">
        <a class="legal-page__brand" routerLink="/">{{ chrome().siteName }}</a>
        <nav aria-label="Navigation">
          <a routerLink="/">{{ chrome().navHome }}</a>
          <a routerLink="/projects">{{ chrome().navProjects }}</a>
          <a routerLink="/" fragment="contact">{{ chrome().navContact }}</a>
          <div class="legal-page__languages" [attr.aria-label]="chrome().languageLabel">
            <button
              type="button"
              [attr.aria-pressed]="language() === 'fr'"
              [class.legal-page__language--active]="language() === 'fr'"
              (click)="languageChange.emit('fr')"
            >
              FR
            </button>
            <button
              type="button"
              [attr.aria-pressed]="language() === 'en'"
              [class.legal-page__language--active]="language() === 'en'"
              (click)="languageChange.emit('en')"
            >
              EN
            </button>
          </div>
        </nav>
      </header>

      <main id="legal-main-content" class="legal-page__content" tabindex="-1">
        <ng-content />
      </main>

      <footer class="legal-page__footer">
        <a routerLink="/">{{ chrome().navHome }}</a>
        <a routerLink="/projects">{{ chrome().navProjects }}</a>
        <a routerLink="/" fragment="contact">{{ chrome().navContact }}</a>
      </footer>
    </div>
  `,
})
export class LegalPageShellComponent {
  readonly language = input.required<PublicLanguage>();
  readonly languageChange = output<PublicLanguage>();

  chrome() {
    return LEGAL_CHROME_COPY[this.language()];
  }
}
