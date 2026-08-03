import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PublicService } from '../../../../admin/services/models/dto/service.dto';
import { HomeCopy } from '../../models/home-page.model';

@Component({
  selector: 'app-services-section',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (services().length) {
      <section class="home-section home-section--muted" id="services" aria-labelledby="home-services-title">
        <div class="home-section__intro">
          <p class="home-eyebrow">{{ copy().servicesEyebrow }}</p>
          <h2 id="home-services-title">{{ copy().servicesTitle }}</h2>
        </div>

        <div class="home-services-grid">
          @for (service of services(); track service.slug || service.title) {
            <article class="home-card home-service-card" [class.home-service-card--featured]="service.featured">
              <div class="home-service-card__heading">
                @if (service.icon) {
                  <i [class]="service.icon" aria-hidden="true"></i>
                }
                <h3>{{ service.title }}</h3>
              </div>
              @if (service.summary) {
                <p>{{ service.summary }}</p>
              }
              @if (service.problem) {
                <p class="home-service-card__problem">{{ service.problem }}</p>
              }

              @if (service.benefits.length) {
                <div>
                  <strong>{{ copy().serviceBenefits }}</strong>
                  <ul>
                    @for (benefit of service.benefits.slice(0, 3); track benefit.label) {
                      <li>{{ benefit.label }}</li>
                    }
                  </ul>
                </div>
              }

              @if (service.technologies.length || service.skills.length) {
                <div class="home-chip-list">
                  @for (technology of service.technologies.slice(0, 3); track technology.id) {
                    <span class="home-chip">{{ technology.name }}</span>
                  }
                  @for (skill of service.skills.slice(0, 2); track skill.id) {
                    <span class="home-chip">{{ skill.name }}</span>
                  }
                </div>
              }

              @if (ctaHref(service); as href) {
                @if (service.ctaLabel) {
                  @if (href === '/projects') {
                    <a class="home-button home-button--quiet" routerLink="/projects">{{ service.ctaLabel }}</a>
                  } @else {
                    <a
                      class="home-button home-button--quiet"
                      [href]="href"
                      [attr.target]="isExternal(href) ? '_blank' : null"
                      [attr.rel]="isExternal(href) ? 'noopener noreferrer' : null"
                    >
                      {{ service.ctaLabel }}
                    </a>
                  }
                }
              }
            </article>
          }
        </div>
      </section>
    }
  `,
})
export class ServicesSectionComponent {
  readonly services = input.required<readonly PublicService[]>();
  readonly copy = input.required<HomeCopy>();
  readonly contactHref = input<string | null>(null);

  ctaHref(service: PublicService): string | null {
    switch (service.ctaType) {
      case 'CONTACT':
        return this.contactHref();
      case 'PROJECTS':
        return '/projects';
      case 'EMAIL':
        return service.ctaTarget ? `mailto:${service.ctaTarget}` : null;
      case 'RESUME':
      case 'EXTERNAL_URL':
        return this.isExternal(service.ctaTarget || '') ? service.ctaTarget : null;
      default:
        return null;
    }
  }

  isExternal(url: string): boolean {
    return /^https?:\/\//i.test(url);
  }
}
