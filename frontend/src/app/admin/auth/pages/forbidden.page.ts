import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="auth-page">
      <section class="auth-panel" aria-labelledby="forbidden-title">
        <p class="auth-kicker">Accès refusé</p>
        <h1 id="forbidden-title">Action non autorisée</h1>
        <p>Votre session ne dispose pas de l'autorisation nécessaire pour cette action.</p>
        <a class="auth-button-link" routerLink="/admin">Retour administration</a>
      </section>
    </main>
  `,
})
export class ForbiddenPage {}
