import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { authErrorMessage } from '../application/auth-message';
import { AuthSessionService } from '../application/auth-session.service';

@Component({
  selector: 'app-forgot-password-page',
  imports: [ReactiveFormsModule, RouterLink, ButtonModule, InputTextModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="auth-page">
      <section class="auth-panel" aria-labelledby="forgot-title">
        <div class="auth-copy">
          <p class="auth-kicker">Récupération</p>
          <h1 id="forgot-title">Mot de passe oublié</h1>
          <p>
            Entrez l'e-mail administrateur. Si le compte existe, une procédure de réinitialisation
            sera préparée sans révéler l'existence du compte.
          </p>
        </div>

        @if (successMessage()) {
          <p class="auth-success" role="status">{{ successMessage() }}</p>
        }

        @if (resetToken()) {
          <p class="auth-dev-token" aria-label="Jeton de réinitialisation local">
            Jeton local/test : <strong>{{ resetToken() }}</strong>
          </p>
        }

        @if (errorMessage()) {
          <p class="auth-error" role="alert">{{ errorMessage() }}</p>
        }

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="auth-form">
          <label>
            <span>Adresse e-mail</span>
            <input pInputText type="email" formControlName="email" autocomplete="username" />
          </label>

          <p-button
            type="submit"
            [label]="submitting() ? 'Préparation...' : 'Préparer la réinitialisation'"
            [disabled]="form.invalid || submitting()"
          />
        </form>

        <nav aria-label="Navigation récupération" class="auth-links">
          <a routerLink="/admin/reset-password">J'ai un jeton</a>
          <a routerLink="/admin/login">Retour connexion</a>
        </nav>
      </section>
    </main>
  `,
})
export class ForgotPasswordPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthSessionService);
  private readonly destroyRef = inject(DestroyRef);

  readonly submitting = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly resetToken = signal<string | null>(null);

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);
    this.auth
      .forgotPassword(this.form.controls.email.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.submitting.set(false);
          this.successMessage.set(response.message);
          this.resetToken.set(response.resetToken ?? null);
        },
        error: (error: unknown) => {
          this.submitting.set(false);
          this.errorMessage.set(authErrorMessage(error));
        },
      });
  }
}
