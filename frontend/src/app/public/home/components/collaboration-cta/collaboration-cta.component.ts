import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PublicPortfolio } from '../../../../admin/profile/models/dto/profile.dto';
import { HomeCopy, PublicLanguage } from '../../models/home-page.model';
import { ContactFormComponent } from '../contact-form/contact-form.component';

@Component({
  selector: 'app-collaboration-cta',
  imports: [ContactFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="home-section home-collaboration" id="contact" aria-labelledby="home-contact-title">
      <div class="home-collaboration__intro">
        <p class="home-eyebrow">{{ copy().collaborationEyebrow }}</p>
        <h2 id="home-contact-title">{{ copy().collaborationTitle }}</h2>
        <p>{{ copy().collaborationText }}</p>

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
      </div>

      <app-contact-form [copy]="copy()" [language]="language()" />
    </section>
  `,
})
export class CollaborationCtaComponent {
  readonly profile = input<PublicPortfolio['profile'] | null>(null);
  readonly copy = input.required<HomeCopy>();
  readonly language = input<PublicLanguage>('fr');

  normalizedPhone(phone: string): string {
    return phone.replace(/[^\d+]/g, '');
  }
}
