import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PublicPortfolio } from '../../../../admin/profile/models/dto/profile.dto';
import { HomeCopy } from '../../models/home-page.model';

@Component({
  selector: 'app-public-footer',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="home-footer">
      <div>
        <strong>{{ settings()?.publicSiteName || copy().defaultSiteName }}</strong>
        @if (profile()?.footerText) {
          <p>{{ profile()?.footerText }}</p>
        } @else if (settings()?.footerCopyright) {
          <p>{{ settings()?.footerCopyright }}</p>
        }
      </div>
      <nav [attr.aria-label]="copy().secondaryNavigation">
        <a routerLink="/projects">{{ copy().navProjects }}</a>
        @if (contactHref(); as href) {
          <a [href]="href">{{ copy().navContact }}</a>
        }
      </nav>
    </footer>
  `,
})
export class PublicFooterComponent {
  readonly settings = input<PublicPortfolio['settings'] | null>(null);
  readonly profile = input<PublicPortfolio['profile'] | null>(null);
  readonly copy = input.required<HomeCopy>();
  readonly contactHref = input<string | null>(null);
}
