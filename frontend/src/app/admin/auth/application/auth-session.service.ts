import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { AuthApiService } from '../api/auth-api.service';
import { AuthSession, ForgotPasswordResponse, LoginCredentials, ResetPasswordRequest } from '../models/dto/auth.dto';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly api = inject(AuthApiService);
  private readonly router = inject(Router);
  private readonly sessionState = signal<AuthSession | null>(null);

  readonly session = computed(() => this.sessionState());
  readonly authenticated = computed(() => this.sessionState() !== null);

  loadCurrentSession(): Observable<boolean> {
    return this.api.me().pipe(
      tap((session) => this.sessionState.set(session)),
      map(() => true),
      catchError((error: unknown) => {
        if (this.api.isUnauthorized(error) || this.api.isForbidden(error)) {
          this.sessionState.set(null);
          return of(false);
        }
        throw error;
      }),
    );
  }

  login(credentials: LoginCredentials): Observable<AuthSession> {
    return this.api.login(credentials).pipe(tap((session) => this.sessionState.set(session)));
  }

  forgotPassword(email: string): Observable<ForgotPasswordResponse> {
    return this.api.forgotPassword({ email });
  }

  resetPassword(request: ResetPasswordRequest): Observable<void> {
    return this.api.resetPassword(request);
  }

  logout(): void {
    this.api.logout().subscribe({
      next: () => {
        this.sessionState.set(null);
        void this.router.navigate(['/admin/login']);
      },
      error: () => {
        this.sessionState.set(null);
        void this.router.navigate(['/admin/session-expired']);
      },
    });
  }
}
