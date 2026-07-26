import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AdminDashboardPage } from './admin-dashboard.page';

describe('AdminDashboardPage', () => {
  let fixture: ComponentFixture<AdminDashboardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardPage],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardPage);
    fixture.detectChanges();
  });

  it('renders dashboard indicators without invented numeric statistics', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Tableau de bord');
    expect(element.textContent).toContain('Projets publiés');
    expect(element.textContent).toContain('Indisponible');
    expect(element.textContent).not.toContain('42');
  });

  it('disables quick actions for modules outside the delivered scope', () => {
    const element = fixture.nativeElement as HTMLElement;
    const disabledActions = Array.from(
      element.querySelectorAll<HTMLButtonElement>('.admin-quick-action--disabled'),
    );

    expect(disabledActions.length).toBe(2);
    expect(disabledActions.some((action) => action.textContent?.includes('Ajouter un projet'))).toBeTrue();
  });

  it('keeps public preview and profile as enabled quick actions', () => {
    const element = fixture.nativeElement as HTMLElement;
    const enabledActions = Array.from(element.querySelectorAll<HTMLAnchorElement>('a.admin-quick-action'));

    expect(enabledActions.length).toBe(2);
    expect(enabledActions[0].textContent).toContain('Prévisualiser le portfolio');
    expect(enabledActions[1].textContent).toContain('Compléter le profil');
  });
});
