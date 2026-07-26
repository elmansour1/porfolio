import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import {
  AuthSession,
  CsrfTokenResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginCredentials,
  ResetPasswordRequest,
} from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/admin/auth';

  csrf(): Observable<CsrfTokenResponse> {
    return this.http.get<CsrfTokenResponse>(`${this.baseUrl}/csrf`, { withCredentials: true });
  }

  login(credentials: LoginCredentials): Observable<AuthSession> {
    return this.withCsrf(
      this.http.post<AuthSession>(`${this.baseUrl}/login`, credentials, { withCredentials: true }),
    );
  }

  me(): Observable<AuthSession> {
    return this.http.get<AuthSession>(`${this.baseUrl}/me`, { withCredentials: true });
  }

  logout(): Observable<void> {
    return this.withCsrf(
      this.http.post<void>(`${this.baseUrl}/logout`, {}, { withCredentials: true }),
    );
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<ForgotPasswordResponse> {
    return this.withCsrf(
      this.http.post<ForgotPasswordResponse>(`${this.baseUrl}/forgot-password`, request, {
        withCredentials: true,
      }),
    );
  }

  resetPassword(request: ResetPasswordRequest): Observable<void> {
    return this.withCsrf(
      this.http.post<void>(`${this.baseUrl}/reset-password`, request, { withCredentials: true }),
    );
  }

  isUnauthorized(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === 401;
  }

  isForbidden(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === 403;
  }

  private withCsrf<T>(request: Observable<T>): Observable<T> {
    return this.csrf().pipe(switchMap(() => request));
  }
}
