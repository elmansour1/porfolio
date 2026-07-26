import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { authErrorMessage } from '../application/auth-message';
import { AuthSessionService } from '../application/auth-session.service';

@Component({
  selector: 'app-admin-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="auth-page">
      <section class="auth-panel" aria-labelledby="login-title">
        <div class="auth-copy">
          <p class="auth-kicker">Administration sécurisée</p>
          <h1 id="login-title">Connexion administrateur</h1>
          <p>
            Accédez à l'espace privé du portfolio pour gérer les contenus après authentification.
          </p>
        </div>

        @if (sessionExpired()) {
          <p class="auth-notice" role="status">Votre session a expiré. Reconnectez-vous pour continuer.</p>
        }

        @if (errorMessage()) {
          <p class="auth-error" role="alert">{{ errorMessage() }}</p>
        }

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="auth-form">
          <label>
            <span>Adresse e-mail</span>
            <input
              type="email"
              formControlName="email"
              autocomplete="username"
              [attr.aria-invalid]="emailInvalid()"
            />
          </label>

          <label>
            <span>Mot de passe</span>
            <input
              type="password"
              formControlName="password"
              autocomplete="current-password"
              [attr.aria-invalid]="passwordInvalid()"
            />
          </label>

          <button type="submit" [disabled]="form.invalid || submitting()">
            {{ submitting() ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <nav aria-label="Aide connexion" class="auth-links">
          <a routerLink="/admin/forgot-password">Mot de passe oublié</a>
          <a routerLink="/">Retour au site public</a>
        </nav>
      </section>
    </main>
  `,
})
export class LoginPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthSessionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly sessionExpired = signal(this.route.snapshot.queryParamMap.get('reason') === 'session-expired');

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);
    this.auth
      .login(this.form.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => void this.router.navigateByUrl(this.safeReturnUrl()),
        error: (error: unknown) => {
          this.submitting.set(false);
          this.errorMessage.set(authErrorMessage(error));
        },
      });
  }

  emailInvalid(): boolean {
    const control = this.form.controls.email;
    return control.invalid && (control.dirty || control.touched);
  }

  passwordInvalid(): boolean {
    const control = this.form.controls.password;
    return control.invalid && (control.dirty || control.touched);
  }

  private safeReturnUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (!returnUrl || !returnUrl.startsWith('/admin') || returnUrl.startsWith('/admin/login')) {
      return '/admin/dashboard';
    }

    return returnUrl;
  }
}
