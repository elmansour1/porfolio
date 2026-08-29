import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { MessagesApiService } from '../messages/api/messages-api.service';
import { AdminEmptyStateComponent } from '../shared/ui/admin-empty-state.component';
import { AdminMetricCardComponent } from '../shared/ui/admin-metric-card.component';
import { AdminQuickActionComponent } from '../shared/ui/admin-quick-action.component';
import { AdminStatusBadgeComponent } from '../shared/ui/admin-status-badge.component';

interface DashboardMetric {
  readonly label: string;
  readonly value: string;
  readonly description: string;
  readonly icon: string;
  readonly statusLabel: string;
  readonly statusTone: 'ready' | 'unavailable' | 'warning' | 'secure';
  readonly labelId: string;
}

interface DashboardAction {
  readonly label: string;
  readonly description: string;
  readonly icon: string;
  readonly route: string;
  readonly disabled: boolean;
}

@Component({
  selector: 'app-admin-dashboard-page',
  imports: [
    AdminEmptyStateComponent,
    AdminMetricCardComponent,
    AdminQuickActionComponent,
    AdminStatusBadgeComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="admin-dashboard">
      <section class="admin-dashboard-hero" aria-labelledby="dashboard-title">
        <div>
          <p class="admin-eyebrow">Pilotage du portfolio</p>
          <h1 id="dashboard-title">Tableau de bord</h1>
          <p>
            Le socle d'administration est prêt. Les indicateurs métier restent indisponibles tant
            que les modules de contenu ne sont pas livrés.
          </p>
        </div>
        <app-admin-status-badge label="Session protégée" tone="secure" />
      </section>

      <section class="admin-section" aria-labelledby="dashboard-overview-title">
        <div class="admin-section__header">
          <div>
            <p class="admin-eyebrow">Vue opérationnelle</p>
            <h2 id="dashboard-overview-title">État des contenus</h2>
          </div>
          <p>
            Aucune valeur chiffrée n'est inventée. Les compteurs seront alimentés par les contrats
            API des sous-phases métier.
          </p>
        </div>

        <div class="admin-metric-grid">
          @for (metric of metrics(); track metric.label) {
            <app-admin-metric-card
              [label]="metric.label"
              [value]="metric.value"
              [description]="metric.description"
              [icon]="metric.icon"
              [statusLabel]="metric.statusLabel"
              [statusTone]="metric.statusTone"
              [labelId]="metric.labelId"
            />
          }
        </div>
      </section>

      <section class="admin-section" aria-labelledby="quick-actions-title">
        <div class="admin-section__header">
          <div>
            <p class="admin-eyebrow">Actions rapides</p>
            <h2 id="quick-actions-title">Préparer les prochaines tâches</h2>
          </div>
        </div>

        <div class="admin-action-grid">
          @for (action of quickActions; track action.label) {
            <app-admin-quick-action
              [label]="action.label"
              [description]="action.description"
              [icon]="action.icon"
              [route]="action.route"
              [disabled]="action.disabled"
            />
          }
        </div>
      </section>

      <section class="admin-dashboard-columns" aria-label="État détaillé">
        <article class="admin-panel">
          <div class="admin-panel__header">
            <div>
              <p class="admin-eyebrow">Publication</p>
              <h2>Portfolio public</h2>
            </div>
            <app-admin-status-badge label="À alimenter" tone="warning" />
          </div>
          <p>
            Le site public reçoit maintenant le profil et les paramètres publiables. Les prochaines
            sous-phases brancheront compétences, projets, services, contact et SEO.
          </p>
          <a class="admin-secondary-link" href="/" target="_blank" rel="noreferrer">
            <i class="pi pi-external-link" aria-hidden="true"></i>
            Prévisualiser le site public
          </a>
        </article>

        <article class="admin-panel">
          <div class="admin-panel__header">
            <div>
              <p class="admin-eyebrow">Activité</p>
              <h2>Modifications récentes</h2>
            </div>
            <app-admin-status-badge label="Journal à venir" tone="unavailable" />
          </div>
          <app-admin-empty-state
            title="Aucune activité de contenu"
            description="Le journal métier sera affiché lorsqu'une sous-phase de gestion de contenu aura été livrée."
            icon="pi pi-history"
            titleId="dashboard-activity-empty"
          />
        </article>
      </section>
    </div>
  `,
})
export class AdminDashboardPage {
  private readonly messagesApi = inject(MessagesApiService);

  readonly unreadMessagesCount = signal<number | null>(null);

  readonly staticMetrics: readonly DashboardMetric[] = [
    {
      label: 'Projets publiés',
      value: 'Indisponible',
      description: "Le module projets n'est pas encore implémenté.",
      icon: 'pi pi-folder-open',
      statusLabel: 'Non connecté',
      statusTone: 'unavailable',
      labelId: 'metric-published-projects',
    },
    {
      label: 'Brouillons',
      value: 'Indisponible',
      description: 'Les brouillons seront suivis après la gestion de contenu.',
      icon: 'pi pi-file-edit',
      statusLabel: 'À venir',
      statusTone: 'unavailable',
      labelId: 'metric-drafts',
    },
    {
      label: 'Sections incomplètes',
      value: 'À vérifier',
      description: 'Les contrôles de complétude seront ajoutés par module métier.',
      icon: 'pi pi-exclamation-triangle',
      statusLabel: 'Sans donnée',
      statusTone: 'warning',
      labelId: 'metric-incomplete-sections',
    },
  ];

  constructor() {
    this.messagesApi.list('NEW', 0, 1).subscribe({
      next: (response) => this.unreadMessagesCount.set(response.totalItems),
      error: () => this.unreadMessagesCount.set(null),
    });
  }

  metrics(): readonly DashboardMetric[] {
    return [this.messagesMetric(), ...this.staticMetrics];
  }

  private messagesMetric(): DashboardMetric {
    const count = this.unreadMessagesCount();
    return {
      label: 'Messages non lus',
      value: count === null ? 'Indisponible' : String(count),
      description:
        count === null
          ? 'Impossible de récupérer les messages pour le moment.'
          : 'Nombre de messages de contact au statut "Nouveau".',
      icon: 'pi pi-inbox',
      statusLabel: count && count > 0 ? 'À traiter' : 'À jour',
      statusTone: count === null ? 'unavailable' : count > 0 ? 'warning' : 'ready',
      labelId: 'metric-unread-messages',
    };
  }

  readonly quickActions: readonly DashboardAction[] = [
    {
      label: 'Prévisualiser le portfolio',
      description: 'Ouvrir le site public dans son état actuel.',
      icon: 'pi pi-eye',
      route: '/',
      disabled: false,
    },
    {
      label: 'Compléter le profil',
      description: 'Renseigner les informations principales du portfolio.',
      icon: 'pi pi-user-edit',
      route: '/admin/profile',
      disabled: false,
    },
    {
      label: 'Ajouter un projet',
      description: "Disponible après GO d'une sous-phase projets.",
      icon: 'pi pi-plus-circle',
      route: '/admin/projects',
      disabled: true,
    },
    {
      label: 'Consulter les messages',
      description: 'Voir les messages reçus via le formulaire de contact public.',
      icon: 'pi pi-send',
      route: '/admin/messages',
      disabled: false,
    },
  ];
}
