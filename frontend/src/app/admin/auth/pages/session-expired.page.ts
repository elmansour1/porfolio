import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-session-expired-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="auth-page">
      <section class="auth-panel" aria-labelledby="session-title">
        <p class="auth-kicker">Session expirée</p>
        <h1 id="session-title">Reconnectez-vous pour continuer</h1>
        <p>Votre session administrateur n'est plus active ou n'a pas pu être vérifiée.</p>
        <a class="auth-button-link" routerLink="/admin/login">Retour à la connexion</a>
      </section>
    </main>
  `,
})
export class SessionExpiredPage {}
