import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { AuthSessionService } from '../application/auth-session.service';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let fixture: ComponentFixture<LoginPage>;
  const auth = {
    login: jasmine.createSpy('login').and.returnValue(
      of({
        id: 'admin-id',
        email: 'admin@example.test',
        passwordChangeRequired: false,
      }),
    ),
  };

  beforeEach(async () => {
    auth.login.calls.reset();
    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: AuthSessionService, useValue: auth },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
  });

  it('renders the administrator login form', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('input[type="email"]')).not.toBeNull();
    expect(element.querySelector('input[type="password"]')).not.toBeNull();
    expect(element.textContent).toContain('Connexion administrateur');
  });

  it('submits typed credentials when the form is valid', () => {
    fixture.componentInstance.form.setValue({
      email: 'admin@example.test',
      password: 'SecurePassword-123',
    });

    fixture.componentInstance.submit();

    expect(auth.login).toHaveBeenCalledWith({
      email: 'admin@example.test',
      password: 'SecurePassword-123',
    });
  });

  it('redirects to the dashboard by default after login', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl').and.resolveTo(true);
    fixture.componentInstance.form.setValue({
      email: 'admin@example.test',
      password: 'SecurePassword-123',
    });

    fixture.componentInstance.submit();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/admin/dashboard');
  });
});
