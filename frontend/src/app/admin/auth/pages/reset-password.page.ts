import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { authErrorMessage } from '../application/auth-message';
import { AuthSessionService } from '../application/auth-session.service';

@Component({
  selector: 'app-reset-password-page',
  imports: [ReactiveFormsModule, RouterLink, ButtonModule, InputTextModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="auth-page">
      <section class="auth-panel" aria-labelledby="reset-title">
        <div class="auth-copy">
          <p class="auth-kicker">Réinitialisation</p>
          <h1 id="reset-title">Définir un nouveau mot de passe</h1>
          <p>
            Utilisez le jeton reçu par canal sécurisé. Le nouveau mot de passe doit respecter la
            politique de sécurité.
          </p>
        </div>

        @if (errorMessage()) {
          <p class="auth-error" role="alert">{{ errorMessage() }}</p>
        }

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="auth-form">
          <label>
            <span>Jeton de réinitialisation</span>
            <input pInputText type="text" formControlName="token" autocomplete="one-time-code" />
          </label>

          <label>
            <span>Nouveau mot de passe</span>
            <input pInputText type="password" formControlName="newPassword" autocomplete="new-password" />
          </label>

          <label>
            <span>Confirmation</span>
            <input pInputText type="password" formControlName="confirmPassword" autocomplete="new-password" />
          </label>

          <p class="auth-hint">
            Minimum 12 caractères avec majuscule, minuscule, chiffre et symbole.
          </p>

          <p-button
            type="submit"
            [label]="submitting() ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'"
            [disabled]="form.invalid || submitting()"
          />
        </form>

        <nav aria-label="Navigation réinitialisation" class="auth-links">
          <a routerLink="/admin/login">Retour connexion</a>
        </nav>
      </section>
    </main>
  `,
})
export class ResetPasswordPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthSessionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.formBuilder.nonNullable.group({
    token: [this.route.snapshot.queryParamMap.get('token') ?? '', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(12)]],
    confirmPassword: ['', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    if (value.newPassword !== value.confirmPassword) {
      this.errorMessage.set('Les deux mots de passe ne correspondent pas.');
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);
    this.auth
      .resetPassword({ token: value.token, newPassword: value.newPassword })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => void this.router.navigate(['/admin/login'], { queryParams: { reset: 'success' } }),
        error: (error: unknown) => {
          this.submitting.set(false);
          this.errorMessage.set(authErrorMessage(error));
        },
      });
  }
}
