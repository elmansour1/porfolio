import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { AuthApiService } from './auth-api.service';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('fetches csrf before login', () => {
    service.login({ email: 'admin@example.test', password: 'SecurePassword-123' }).subscribe((session) => {
      expect(session.email).toBe('admin@example.test');
    });

    const csrfRequest = http.expectOne('/api/v1/admin/auth/csrf');
    expect(csrfRequest.request.method).toBe('GET');
    csrfRequest.flush({ headerName: 'X-XSRF-TOKEN', parameterName: '_csrf', token: 'csrf-token' });

    const loginRequest = http.expectOne('/api/v1/admin/auth/login');
    expect(loginRequest.request.method).toBe('POST');
    expect(loginRequest.request.withCredentials).toBeTrue();
    loginRequest.flush({
      id: 'admin-id',
      email: 'admin@example.test',
      passwordChangeRequired: false,
    });
  });
});
