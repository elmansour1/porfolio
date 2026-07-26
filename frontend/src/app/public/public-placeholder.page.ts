import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject, signal } from '@angular/core';

import { ProfileApiService } from '../admin/profile/profile-api.service';
import { PublicPortfolio } from '../admin/profile/profile.models';

@Component({
  selector: 'app-public-placeholder-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="public-profile" [class.public-profile--loading]="loading()">
      @if (portfolio(); as portfolio) {
        <nav class="public-profile__nav" aria-label="Navigation publique">
          <a class="public-profile__brand" href="/">
            @if (portfolio.settings.logoUrl) {
              <img [src]="portfolio.settings.logoUrl" alt="" />
            } @else {
              <span>{{ portfolio.settings.monogram }}</span>
            }
            {{ portfolio.settings.publicSiteName }}
          </a>
          <div class="public-profile__languages" aria-label="Langue">
            @for (language of portfolio.settings.activeLanguages; track language) {
              <button
                type="button"
                [class.public-profile__language--active]="language === selectedLanguage()"
                (click)="changeLanguage(language)"
              >
                {{ language.toUpperCase() }}
              </button>
            }
          </div>
          <a href="/admin/login">Administration</a>
        </nav>

        @if (portfolio.profilePublished && portfolio.profile; as profile) {
          <section class="public-hero" aria-labelledby="public-title">
            <div class="public-hero__content">
              @if (profile.availabilityLabel) {
                <p class="public-availability">{{ profile.availabilityLabel }}</p>
              }
              <h1 id="public-title">{{ profile.displayName }}</h1>
              <p class="public-hero__title">{{ profile.professionalTitle }}</p>
              @if (profile.shortSummary) {
                <p class="public-hero__summary">{{ profile.shortSummary }}</p>
              }
              <div class="public-hero__actions">
                @if (profile.primaryCtaLabel && profile.primaryCtaUrl) {
                  <a class="public-button public-button--primary" [href]="profile.primaryCtaUrl">
                    {{ profile.primaryCtaLabel }}
                  </a>
                }
                @if (profile.secondaryCtaLabel && profile.secondaryCtaUrl) {
                  <a
                    class="public-button"
                    [href]="profile.secondaryCtaUrl"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {{ profile.secondaryCtaLabel }}
                  </a>
                }
                @if (profile.cvUrl) {
                  <a class="public-button" [href]="profile.cvUrl">Télécharger le CV</a>
                }
              </div>
            </div>
            <div class="public-hero__media" aria-label="Photo professionnelle">
              @if (profile.photoUrl) {
                <img [src]="profile.photoUrl" [alt]="profile.photoAltText || profile.displayName" />
              } @else {
                <span>{{ initials(profile.displayName) }}</span>
              }
            </div>
          </section>

          @if (profile.statistics.length) {
            <section class="public-stats" aria-label="Indicateurs professionnels">
              @for (statistic of profile.statistics; track statistic.label) {
                <article>
                  <strong>{{ statistic.value }}</strong>
                  <span>{{ statistic.label }}</span>
                </article>
              }
            </section>
          }

          @if (profile.aboutText || profile.biography) {
            <section class="public-about" aria-labelledby="public-about-title">
              <p class="public-eyebrow">À propos</p>
              <h2 id="public-about-title">{{ profile.tagline || profile.professionalTitle }}</h2>
              <p>{{ profile.aboutText || profile.biography }}</p>
            </section>
          }

          <footer class="public-footer">
            <div>
              <strong>{{ profile.displayName }}</strong>
              @if (profile.footerText) {
                <p>{{ profile.footerText }}</p>
              }
              @if (portfolio.settings.footerCopyright) {
                <small>{{ portfolio.settings.footerCopyright }}</small>
              }
            </div>
            @if (profile.links.length) {
              <div class="public-links" aria-label="Liens professionnels">
                @for (link of profile.links; track link.url) {
                  <a
                    [href]="link.url"
                    [target]="link.openInNewTab ? '_blank' : '_self'"
                    rel="noreferrer"
                  >
                    {{ link.label }}
                  </a>
                }
              </div>
            }
          </footer>
        } @else {
          <section class="public-empty" aria-labelledby="public-empty-title">
            <p class="public-eyebrow">Portfolio professionnel</p>
            <h1 id="public-empty-title">Profil non publié</h1>
            <p>
              Les informations publiques seront visibles après publication du profil et d'une
              traduction complète.
            </p>
            <a href="/admin/login">Accéder à l'administration</a>
          </section>
        }
      } @else if (loading()) {
        <section class="public-empty" aria-live="polite">Chargement du portfolio...</section>
      } @else {
        <section class="public-empty public-empty--error">
          Le portfolio public n'est pas disponible pour le moment.
        </section>
      }
    </main>
  `,
})
export class PublicPlaceholderPage {
  private readonly api = inject(ProfileApiService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly selectedLanguage = signal<'fr' | 'en'>('fr');
  readonly loading = signal(true);
  readonly portfolio = signal<PublicPortfolio | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.load('fr');
    } else {
      this.loading.set(false);
    }
  }

  changeLanguage(language: 'fr' | 'en'): void {
    this.selectedLanguage.set(language);
    this.load(language);
  }

  initials(displayName: string): string {
    return displayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  private load(language: 'fr' | 'en'): void {
    this.loading.set(true);
    this.api.publicPortfolio(language).subscribe({
      next: (portfolio) => {
        this.portfolio.set(portfolio);
        this.loading.set(false);
      },
      error: () => {
        this.portfolio.set(null);
        this.loading.set(false);
      },
    });
  }
}
