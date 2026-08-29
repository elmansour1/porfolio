import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { AdminEmptyStateComponent } from '../../shared/ui/admin-empty-state.component';
import { MessagesApiService } from '../api/messages-api.service';
import {
  ContactMessageDetail,
  ContactMessageStatus,
  ContactMessageSummary,
  ContactMetadata,
} from '../models/dto/message.dto';

@Component({
  selector: 'app-messages-page',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    SelectModule,
    TableModule,
    TagModule,
    AdminEmptyStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="admin-content-page messages-page">
      <section class="admin-dashboard-hero" aria-labelledby="messages-title">
        <div>
          <p class="admin-eyebrow">Contact</p>
          <h1 id="messages-title">Messages reçus</h1>
          <p>
            Consultez les messages transmis via le formulaire public et suivez leur statut de
            traitement. Aucune réponse ne peut être envoyée depuis cette interface.
          </p>
        </div>
        <p-tag [value]="'Nouveaux : ' + unreadCount()" [severity]="unreadCount() > 0 ? 'warn' : 'success'" />
      </section>

      @if (loading()) {
        <section class="admin-section" aria-live="polite">Chargement des messages...</section>
      } @else if (loadError()) {
        <section class="admin-section admin-form-message admin-form-message--error">
          {{ loadError() }}
        </section>
      } @else {
        <section class="admin-section" aria-labelledby="message-list-title">
          <div class="admin-section__header">
            <div>
              <p class="admin-eyebrow">Boîte de réception</p>
              <h2 id="message-list-title">Messages</h2>
            </div>
          </div>

          <div class="admin-filter-bar" aria-label="Filtres messages">
            <label for="message-status-filter">
              <span>Statut</span>
              <p-select
                inputId="message-status-filter"
                [options]="statusOptions()"
                optionLabel="label"
                optionValue="value"
                [showClear]="true"
                placeholder="Tous"
                [formControl]="statusFilter"
              />
            </label>
            <p-button label="Filtrer" icon="pi pi-filter" size="small" (onClick)="loadMessages()" />
          </div>

          @if (messages().length) {
            <p-table [value]="messages()" [paginator]="messages().length > 10" [rows]="10" styleClass="admin-prime-table" responsiveLayout="stack">
              <ng-template pTemplate="header">
                <tr>
                  <th>Expéditeur</th>
                  <th>Sujet</th>
                  <th>Type</th>
                  <th>Statut</th>
                  <th>Reçu le</th>
                  <th>Actions</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-item>
                <tr>
                  <td>
                    <strong>{{ item.name }}</strong>
                    <p>{{ item.email }}</p>
                  </td>
                  <td>{{ item.subject }}</td>
                  <td>{{ requestTypeLabel(item.requestType) }}</td>
                  <td><p-tag [value]="statusLabel(item.status)" [severity]="statusSeverity(item.status)" /></td>
                  <td>{{ item.createdAt | date: 'dd/MM/yyyy HH:mm' }}</td>
                  <td class="admin-table-actions">
                    <p-button icon="pi pi-eye" label="Voir" size="small" severity="secondary" (onClick)="openDetail(item)" />
                  </td>
                </tr>
              </ng-template>
            </p-table>
          } @else {
            <app-admin-empty-state
              icon="pi pi-inbox"
              title="Aucun message"
              description="Aucun message ne correspond aux filtres sélectionnés."
            />
          }
        </section>
      }
    </div>

    <p-dialog
      [modal]="true"
      [visible]="detailDialogVisible()"
      (visibleChange)="detailDialogVisible.set($event)"
      [draggable]="false"
      [resizable]="false"
      styleClass="admin-form-dialog admin-form-dialog--wide"
      header="Détail du message"
    >
      @if (detail(); as message) {
        <div class="admin-dialog-body">
          <section class="admin-form-section">
            <h3>Expéditeur</h3>
            <div class="admin-form-grid">
              <div class="admin-field"><span>Nom</span><strong>{{ message.name }}</strong></div>
              <div class="admin-field"><span>E-mail</span><strong>{{ message.email }}</strong></div>
              <div class="admin-field"><span>Entreprise</span><strong>{{ message.company || 'Non renseignée' }}</strong></div>
              <div class="admin-field"><span>Type de demande</span><strong>{{ requestTypeLabel(message.requestType) }}</strong></div>
              <div class="admin-field"><span>Reçu le</span><strong>{{ message.createdAt | date: 'dd/MM/yyyy HH:mm' }}</strong></div>
              <div class="admin-field"><span>Dernière mise à jour</span><strong>{{ message.updatedAt | date: 'dd/MM/yyyy HH:mm' }}</strong></div>
              <div class="admin-field"><span>Consentement</span><strong>{{ message.consent ? 'Donné' : 'Non donné' }}</strong></div>
              <div class="admin-field"><span>Adresse IP</span><strong>{{ message.ipAddress || 'Non disponible' }}</strong></div>
            </div>
          </section>

          <section class="admin-form-section">
            <h3>Message</h3>
            <p><strong>Sujet :</strong> {{ message.subject }}</p>
            <p class="admin-message-body">{{ message.message }}</p>
          </section>

          <section class="admin-form-section">
            <h3>Statut</h3>
            <div class="admin-form-grid">
              <label for="message-status">
                <span>Changer le statut</span>
                <p-select
                  inputId="message-status"
                  [options]="statusOptions()"
                  optionLabel="label"
                  optionValue="value"
                  [formControl]="statusControl"
                />
              </label>
            </div>
          </section>
        </div>

        <div class="admin-dialog-footer">
          <p-button type="button" label="Fermer" icon="pi pi-times" severity="secondary" (onClick)="closeDetail()" />
          <p-button
            type="button"
            label="Enregistrer le statut"
            icon="pi pi-save"
            [disabled]="statusControl.value === message.status || saving()"
            (onClick)="saveStatus(message)"
          />
        </div>
      }
    </p-dialog>
  `,
})
export class MessagesPage {
  private readonly api = inject(MessagesApiService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly messages = signal<ContactMessageSummary[]>([]);
  readonly metadata = signal<ContactMetadata | null>(null);
  readonly unreadCount = signal(0);
  readonly detail = signal<ContactMessageDetail | null>(null);
  readonly detailDialogVisible = signal(false);
  readonly statusFilter = new FormControl<ContactMessageStatus | null>(null);
  readonly statusControl = new FormControl<ContactMessageStatus>('NEW', { nonNullable: true });

  constructor() {
    this.loadAll();
  }

  statusOptions() {
    return [...(this.metadata()?.statuses ?? [])];
  }

  requestTypeLabel(type: string): string {
    return this.metadata()?.requestTypes.find((option) => option.value === type)?.label ?? type;
  }

  statusLabel(status: string): string {
    return this.statusOptions().find((option) => option.value === status)?.label ?? status;
  }

  statusSeverity(status: ContactMessageStatus): 'success' | 'warn' | 'secondary' | 'danger' | 'info' {
    switch (status) {
      case 'NEW':
        return 'warn';
      case 'TO_REPLY':
        return 'info';
      case 'REPLIED':
        return 'success';
      case 'SPAM':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  loadAll(): void {
    this.loading.set(true);
    forkJoin({
      metadata: this.api.metadata(),
      messages: this.api.list(this.statusFilter.value, 0, 50),
      unread: this.api.list('NEW', 0, 1),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ metadata, messages, unread }) => {
          this.metadata.set(metadata);
          this.messages.set([...messages.items]);
          this.unreadCount.set(unread.totalItems);
          this.loadError.set(null);
        },
        error: () => this.loadError.set('Impossible de charger les messages.'),
      });
  }

  loadMessages(): void {
    this.api.list(this.statusFilter.value, 0, 50).subscribe({
      next: (response) => this.messages.set([...response.items]),
      error: () => this.loadError.set('Impossible de filtrer les messages.'),
    });
  }

  refreshUnreadCount(): void {
    this.api.list('NEW', 0, 1).subscribe((response) => this.unreadCount.set(response.totalItems));
  }

  openDetail(item: ContactMessageSummary): void {
    this.api.detail(item.id).subscribe((detail) => {
      this.detail.set(detail);
      this.statusControl.setValue(detail.status);
      this.detailDialogVisible.set(true);
    });
  }

  closeDetail(): void {
    this.detailDialogVisible.set(false);
    this.detail.set(null);
  }

  saveStatus(message: ContactMessageDetail): void {
    this.saving.set(true);
    this.api
      .updateStatus(message.id, this.statusControl.value)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (updated) => {
          this.detail.set(updated);
          this.closeDetail();
          this.loadMessages();
          this.refreshUnreadCount();
        },
        error: () => this.loadError.set('Impossible de mettre à jour le statut du message.'),
      });
  }
}
