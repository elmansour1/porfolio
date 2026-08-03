import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { PublicPortfolio } from '../../../../admin/profile/models/dto/profile.dto';
import { HomeCopy, HomeNavigationItem, PublicLanguage } from '../../models/home-page.model';

@Component({
  selector: 'app-public-header',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="home-header" [class.home-header--scrolled]="scrolled()">
      <a class="home-skip-link" href="#main-content">{{ copy().skipToContent }}</a>
      <nav class="home-header__nav" [attr.aria-label]="copy().primaryNavigation">
        <a class="home-header__brand" href="/" (click)="closeMenu()">
          @if (settings()?.logoUrl) {
            <img [src]="settings()?.logoUrl" alt="" />
          } @else {
            <span aria-hidden="true">{{ settings()?.monogram || copy().defaultMonogram }}</span>
          }
          <strong>{{ settings()?.publicSiteName || copy().defaultSiteName }}</strong>
        </a>

        <button
          #menuButton
          class="home-header__menu-button"
          type="button"
          [attr.aria-label]="menuOpen() ? copy().menuClose : copy().menuOpen"
          [attr.aria-expanded]="menuOpen()"
          aria-controls="home-navigation-panel"
          (click)="toggleMenu()"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>

        <div
          id="home-navigation-panel"
          class="home-header__panel"
          [class.home-header__panel--open]="menuOpen()"
        >
          <div class="home-header__links">
            @for (item of navigation(); track item.fragment) {
              <a [href]="'#' + item.fragment" (click)="closeMenu()">{{ item.label }}</a>
            }
            <a routerLink="/projects" (click)="closeMenu()">{{ copy().navProjects }}</a>
          </div>

          <div class="home-header__actions">
            <div class="home-header__languages" [attr.aria-label]="copy().languageLabel">
              @for (language of activeLanguages(); track language) {
                <button
                  type="button"
                  [attr.aria-pressed]="language === languageValue()"
                  [class.home-header__language--active]="language === languageValue()"
                  (click)="selectLanguage(language)"
                >
                  {{ language.toUpperCase() }}
                </button>
              }
            </div>
            @if (contactHref(); as href) {
              <a class="home-button home-button--primary" [href]="href" (click)="closeMenu()">
                {{ copy().navContact }}
              </a>
            }
          </div>
        </div>
      </nav>
    </header>
  `,
})
export class PublicHeaderComponent {
  readonly settings = input<PublicPortfolio['settings'] | null>(null);
  readonly copy = input.required<HomeCopy>();
  readonly languageValue = input.required<PublicLanguage>();
  readonly navigation = input.required<readonly HomeNavigationItem[]>();
  readonly contactHref = input<string | null>(null);
  readonly languageChange = output<PublicLanguage>();

  @ViewChild('menuButton') private readonly menuButton?: ElementRef<HTMLButtonElement>;

  readonly menuOpen = signal(false);
  readonly scrolled = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(globalThis.scrollY > 20);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.menuOpen()) {
      return;
    }
    this.menuOpen.set(false);
    this.menuButton?.nativeElement.focus();
  }

  activeLanguages(): readonly PublicLanguage[] {
    const languages = this.settings()?.activeLanguages ?? ['fr', 'en'];
    return languages.length ? languages : ['fr', 'en'];
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  selectLanguage(language: PublicLanguage): void {
    this.closeMenu();
    if (language !== this.languageValue()) {
      this.languageChange.emit(language);
    }
  }
}
