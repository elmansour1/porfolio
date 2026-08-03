import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PublicPortfolio } from '../../../../admin/profile/models/dto/profile.dto';
import { HomeCopy } from '../../models/home-page.model';

@Component({
  selector: 'app-collaboration-cta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="home-section home-collaboration" id="contact" aria-labelledby="home-contact-title">
      <div>
        <p class="home-eyebrow">{{ copy().collaborationEyebrow }}</p>
        <h2 id="home-contact-title">{{ copy().collaborationTitle }}</h2>
        <p>{{ copy().collaborationText }}</p>
      </div>

      @if (profile(); as profile) {
        <address class="home-contact-list">
          @if (profile.professionalEmail) {
            <a [href]="'mailto:' + profile.professionalEmail">
              <span>{{ copy().emailLabel }}</span>
              <strong>{{ profile.professionalEmail }}</strong>
            </a>
          }
          @if (profile.phone) {
            <a [href]="'tel:' + normalizedPhone(profile.phone)">
              <span>{{ copy().phoneLabel }}</span>
              <strong>{{ profile.phone }}</strong>
            </a>
          }
          @for (link of profile.links; track link.url) {
            <a
              [href]="link.url"
              [attr.target]="link.openInNewTab ? '_blank' : null"
              [attr.rel]="link.openInNewTab ? 'noopener noreferrer' : null"
            >
              <span>{{ link.type }}</span>
              <strong>{{ link.label }}</strong>
            </a>
          }
        </address>
      }
    </section>
  `,
})
export class CollaborationCtaComponent {
  readonly profile = input<PublicPortfolio['profile'] | null>(null);
  readonly copy = input.required<HomeCopy>();

  normalizedPhone(phone: string): string {
    return phone.replace(/[^\d+]/g, '');
  }
}
