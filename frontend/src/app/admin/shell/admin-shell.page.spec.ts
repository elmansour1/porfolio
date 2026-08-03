import { signal } from '@angular/core';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthSessionService } from '../auth/application/auth-session.service';
import { AdminShellPage } from './admin-shell.page';

describe('AdminShellPage', () => {
  let fixture: ComponentFixture<AdminShellPage>;
  const auth = {
    session: signal({
      id: 'admin-id',
      email: 'admin@example.test',
      passwordChangeRequired: false,
    }),
    logout: jasmine.createSpy('logout'),
  };

  beforeEach(async () => {
    auth.logout.calls.reset();
    await TestBed.configureTestingModule({
      imports: [AdminShellPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: AuthSessionService, useValue: auth },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminShellPage);
    fixture.detectChanges();
  });

  it('renders one reusable admin layout with navigation and account context', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.admin-sidebar')).not.toBeNull();
    expect(element.querySelector('.admin-toolbar')).not.toBeNull();
    expect(element.querySelector('router-outlet')).not.toBeNull();
    expect(element.textContent).toContain('Tableau de bord');
    expect(element.textContent).toContain('admin@example.test');
  });

  it('keeps future content sections disabled while services are available', () => {
    const element = fixture.nativeElement as HTMLElement;
    const disabledItems = Array.from(element.querySelectorAll<HTMLButtonElement>('.admin-nav-item--disabled'));

    expect(disabledItems.length).toBeGreaterThan(0);
    expect(disabledItems.some((item) => item.textContent?.includes('Messages'))).toBeTrue();
    expect(element.textContent).toContain('Services');
    expect(disabledItems.every((item) => item.disabled)).toBeTrue();
  });

  it('opens and closes mobile navigation with escape', () => {
    fixture.componentInstance.toggleMobileNavigation();
    fixture.detectChanges();

    expect(fixture.componentInstance.mobileNavigationOpen()).toBeTrue();

    fixture.componentInstance.closeTransientPanels();
    fixture.detectChanges();

    expect(fixture.componentInstance.mobileNavigationOpen()).toBeFalse();
  });

  it('delegates logout to the existing auth session service', () => {
    const logoutButton = fixture.nativeElement.querySelector('.admin-logout-button') as HTMLButtonElement;

    logoutButton.click();

    expect(auth.logout).toHaveBeenCalled();
  });
});
