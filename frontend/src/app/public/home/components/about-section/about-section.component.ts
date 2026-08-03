import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PublicPortfolio } from '../../../../admin/profile/models/dto/profile.dto';
import { HomeCopy } from '../../models/home-page.model';

@Component({
  selector: 'app-about-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (profile(); as profile) {
      @if (profile.aboutText || profile.biography || profile.location || profile.country) {
        <section class="home-section home-section--about" id="about" aria-labelledby="home-about-title">
          <div class="home-section__intro">
            <p class="home-eyebrow">{{ copy().aboutEyebrow }}</p>
            <h2 id="home-about-title">{{ profile.tagline || profile.professionalTitle || profile.displayName }}</h2>
          </div>
          <div class="home-about__body">
            @if (profile.aboutText || profile.biography) {
              <p>{{ profile.aboutText || profile.biography }}</p>
            }
            @if (profile.location || profile.country) {
              <p class="home-about__location">{{ locationLabel(profile) }}</p>
            }
          </div>
        </section>
      }
    }
  `,
})
export class AboutSectionComponent {
  readonly profile = input<PublicPortfolio['profile'] | null>(null);
  readonly copy = input.required<HomeCopy>();

  locationLabel(profile: NonNullable<PublicPortfolio['profile']>): string {
    return [profile.location, profile.country].filter((value): value is string => Boolean(value)).join(', ');
  }
}
