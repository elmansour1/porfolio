import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PublicPortfolio } from '../../../../admin/profile/models/dto/profile.dto';
import { HomeCopy } from '../../models/home-page.model';

@Component({
  selector: 'app-hero-section',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="home-hero" aria-labelledby="home-hero-title">
      @if (profile(); as profile) {
        <div class="home-hero__content">
          @if (profile.availabilityLabel) {
            <p class="home-eyebrow">{{ profile.availabilityLabel }}</p>
          }
          <h1 id="home-hero-title">{{ profile.displayName }}</h1>
          @if (profile.professionalTitle) {
            <p class="home-hero__title">{{ profile.professionalTitle }}</p>
          }
          @if (profile.shortSummary || profile.tagline) {
            <p class="home-hero__summary">{{ profile.shortSummary || profile.tagline }}</p>
          }
          <div class="home-hero__actions">
            @if (primaryHref(profile); as href) {
              <a
                class="home-button home-button--primary"
                [href]="href"
                [attr.target]="isExternal(href) ? '_blank' : null"
                [attr.rel]="isExternal(href) ? 'noopener noreferrer' : null"
              >
                {{ profile.primaryCtaLabel || copy().viewProjects }}
              </a>
            }
            @if (secondaryHref(profile); as href) {
              <a
                class="home-button"
                [href]="href"
                [attr.target]="isExternal(href) ? '_blank' : null"
                [attr.rel]="isExternal(href) ? 'noopener noreferrer' : null"
              >
                {{ profile.secondaryCtaLabel || copy().contact }}
              </a>
            }
            @if (profile.cvUrl) {
              <a class="home-button home-button--quiet" [href]="profile.cvUrl">
                {{ copy().downloadResume }}
              </a>
            }
          </div>
        </div>

        <div class="home-hero__media" [attr.aria-label]="copy().professionalPortrait">
          @if (profile.photoUrl) {
            <img
              [src]="profile.photoUrl"
              [alt]="profile.photoAltText || profile.displayName"
              width="520"
              height="620"
              fetchpriority="high"
            />
          } @else {
            <span>{{ initials(profile.displayName) }}</span>
          }
        </div>
      } @else {
        <div class="home-hero__content">
          <h1 id="home-hero-title">{{ copy().unavailableTitle }}</h1>
          <p class="home-hero__summary">{{ copy().unavailableMessage }}</p>
          <div class="home-hero__actions">
            <a class="home-button home-button--primary" routerLink="/projects">
              {{ copy().viewProjects }}
            </a>
            @if (servicesHref(); as href) {
              <a class="home-button" [href]="href">{{ copy().servicesTitle }}</a>
            }
          </div>
        </div>
        <div class="home-hero__media home-hero__media--empty" aria-hidden="true">
          <span>{{ copy().defaultMonogram }}</span>
        </div>
      }
    </section>
  `,
})
export class HeroSectionComponent {
  readonly profile = input<PublicPortfolio['profile'] | null>(null);
  readonly copy = input.required<HomeCopy>();
  readonly contactHref = input<string | null>(null);
  readonly servicesHref = input<string | null>(null);

  initials(displayName: string): string {
    return displayName
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  primaryHref(profile: NonNullable<PublicPortfolio['profile']>): string | null {
    return profile.primaryCtaUrl || '/projects';
  }

  secondaryHref(profile: NonNullable<PublicPortfolio['profile']>): string | null {
    const url = profile.secondaryCtaUrl || this.contactHref();
    if (url === '#contact' && !this.contactHref()) {
      return null;
    }
    return url;
  }

  isExternal(url: string): boolean {
    return /^https?:\/\//i.test(url);
  }
}
