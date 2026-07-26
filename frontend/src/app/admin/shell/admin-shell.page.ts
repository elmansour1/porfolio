import { ChangeDetectionStrategy, Component, DestroyRef, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { AuthSessionService } from '../auth/application/auth-session.service';
import { adminNavigationItems, adminPageTitle } from './admin-navigation';

@Component({
  selector: 'app-admin-shell-page',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="admin-layout" [class.admin-layout--nav-open]="mobileNavigationOpen()">
      <a class="admin-skip-link" href="#admin-main-content">Aller au contenu</a>

      <aside class="admin-sidebar" aria-label="Navigation administration">
        <div class="admin-sidebar__brand">
          <a class="admin-brand" routerLink="/admin/dashboard" aria-label="Tableau de bord">
            <span class="admin-brand__mark" aria-hidden="true">FE</span>
            <span>
              <strong>Faouzi Admin</strong>
              <small>Portfolio</small>
            </span>
          </a>
        </div>

        <nav class="admin-sidebar__nav" aria-label="Sections administrateur">
          @for (item of navigationItems; track item.label) {
            @if (item.status === 'available') {
              <a
                class="admin-nav-item"
                [routerLink]="item.route"
                routerLinkActive="admin-nav-item--active"
                [routerLinkActiveOptions]="{ exact: item.route === '/admin/dashboard' }"
                (click)="closeMobileNavigation()"
              >
                <i [class]="item.icon" aria-hidden="true"></i>
                <span>{{ item.label }}</span>
              </a>
            } @else {
              <button
                class="admin-nav-item admin-nav-item--disabled"
                type="button"
                disabled
                [attr.title]="item.hint"
              >
                <i [class]="item.icon" aria-hidden="true"></i>
                <span>{{ item.label }}</span>
                <small>À venir</small>
              </button>
            }
          }
        </nav>

        <div class="admin-sidebar__account">
          @if (auth.session(); as session) {
            <div class="admin-account-card">
              <span class="admin-account-card__avatar" aria-hidden="true">
                {{ accountInitial(session.email) }}
              </span>
              <span>
                <strong>{{ session.email }}</strong>
                <small>Administrateur</small>
              </span>
            </div>
          }
          <button class="admin-logout-button" type="button" (click)="logout()">
            <i class="pi pi-sign-out" aria-hidden="true"></i>
            Déconnexion
          </button>
        </div>
      </aside>

      @if (mobileNavigationOpen()) {
        <button
          class="admin-mobile-overlay"
          type="button"
          aria-label="Fermer la navigation"
          (click)="closeMobileNavigation()"
        ></button>
      }

      <div class="admin-workspace">
        <header class="admin-toolbar">
          <button
            class="admin-icon-button admin-toolbar__menu"
            type="button"
            aria-label="Ouvrir la navigation"
            [attr.aria-expanded]="mobileNavigationOpen()"
            (click)="toggleMobileNavigation()"
          >
            <i class="pi pi-bars" aria-hidden="true"></i>
          </button>

          <div class="admin-toolbar__title">
            <p class="admin-eyebrow">Administration</p>
            <h1>{{ pageTitle() }}</h1>
          </div>

          <div class="admin-toolbar__actions">
            <a class="admin-preview-link" href="/" target="_blank" rel="noreferrer">
              <i class="pi pi-external-link" aria-hidden="true"></i>
              <span>Voir le site</span>
            </a>
            <button
              class="admin-account-menu"
              type="button"
              [attr.aria-expanded]="accountMenuOpen()"
              aria-controls="admin-account-menu-panel"
              (click)="toggleAccountMenu()"
            >
              <i class="pi pi-user" aria-hidden="true"></i>
              <span>Compte</span>
            </button>

            @if (accountMenuOpen()) {
              <div id="admin-account-menu-panel" class="admin-account-menu__panel" role="menu">
                @if (auth.session(); as session) {
                  <p>{{ session.email }}</p>
                }
                <button type="button" role="menuitem" (click)="logout()">
                  <i class="pi pi-sign-out" aria-hidden="true"></i>
                  Déconnexion
                </button>
              </div>
            }
          </div>
        </header>

        <main id="admin-main-content" class="admin-main" tabindex="-1">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AdminShellPage {
  readonly auth = inject(AuthSessionService);
  readonly navigationItems = adminNavigationItems;
  readonly mobileNavigationOpen = signal(false);
  readonly accountMenuOpen = signal(false);
  readonly pageTitle = signal('Tableau de bord');

  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.pageTitle.set(adminPageTitle(this.router.url));
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.pageTitle.set(adminPageTitle(event.urlAfterRedirects));
        this.closeMobileNavigation();
        this.accountMenuOpen.set(false);
      });
  }

  @HostListener('document:keydown.escape')
  closeTransientPanels(): void {
    this.closeMobileNavigation();
    this.accountMenuOpen.set(false);
  }

  toggleMobileNavigation(): void {
    this.mobileNavigationOpen.update((open) => !open);
  }

  closeMobileNavigation(): void {
    this.mobileNavigationOpen.set(false);
  }

  toggleAccountMenu(): void {
    this.accountMenuOpen.update((open) => !open);
  }

  logout(): void {
    this.accountMenuOpen.set(false);
    this.auth.logout();
  }

  accountInitial(email: string): string {
    return email.trim().charAt(0).toUpperCase() || 'A';
  }
}
