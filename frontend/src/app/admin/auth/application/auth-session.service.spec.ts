import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthApiService } from '../api/auth-api.service';
import { AuthSessionService } from './auth-session.service';

describe('AuthSessionService', () => {
  it('clears session and returns false when current session is unauthorized', (done) => {
    const api = {
      me: () => throwError(() => new HttpErrorResponse({ status: 401 })),
      isUnauthorized: (error: unknown) => error instanceof HttpErrorResponse && error.status === 401,
      isForbidden: () => false,
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: AuthApiService, useValue: api },
      ],
    });

    const service = TestBed.inject(AuthSessionService);
    service.loadCurrentSession().subscribe((authenticated) => {
      expect(authenticated).toBeFalse();
      expect(service.session()).toBeNull();
      done();
    });
  });

  it('stores session after login', (done) => {
    const api = {
      login: () =>
        of({
          id: 'admin-id',
          email: 'admin@example.test',
          passwordChangeRequired: false,
        }),
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: AuthApiService, useValue: api },
      ],
    });

    const service = TestBed.inject(AuthSessionService);
    service.login({ email: 'admin@example.test', password: 'SecurePassword-123' }).subscribe(() => {
      expect(service.session()?.email).toBe('admin@example.test');
      done();
    });
  });
});
