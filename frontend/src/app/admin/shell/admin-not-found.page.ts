import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AdminEmptyStateComponent } from '../shared/ui/admin-empty-state.component';

@Component({
  selector: 'app-admin-not-found-page',
  imports: [AdminEmptyStateComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="admin-not-found" aria-labelledby="admin-not-found-title">
      <app-admin-empty-state
        title="Page d'administration introuvable"
        description="Cette route ne correspond à aucune section disponible de l'espace administrateur."
        icon="pi pi-map"
        titleId="admin-not-found-title"
      />
      <a class="admin-primary-link" routerLink="/admin/dashboard">
        <i class="pi pi-arrow-left" aria-hidden="true"></i>
        Revenir au tableau de bord
      </a>
    </section>
  `,
})
export class AdminNotFoundPage {}
