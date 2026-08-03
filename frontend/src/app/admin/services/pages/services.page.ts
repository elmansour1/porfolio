import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { PublicationStatus } from '../../profile/models/dto/profile.dto';
import { AdminEmptyStateComponent } from '../../shared/ui/admin-empty-state.component';
import { SelectOption } from '../../../shared/models/select-option.model';
import { ServicesApiService } from '../api/services-api.service';
import {
  ServiceAdminSummary,
  ServiceMetadata,
  ServiceReference,
  ServiceCtaType,
  WorkProcessStep,
} from '../models/dto/service.dto';
import { ServiceForm, ServiceItemForm, WorkProcessStepForm } from '../models/forms/service-form.model';
import {
  addEmptyItem,
  createServiceForm,
  createWorkProcessStepForm,
  servicePayload,
  workProcessStepPayload,
} from '../mappers/service-form.mapper';

@Component({
  selector: 'app-services-page',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputNumberModule,
    InputTextModule,
    MultiSelectModule,
    SelectModule,
    TableModule,
    TabsModule,
    TagModule,
    TextareaModule,
    ToggleSwitchModule,
    AdminEmptyStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="admin-content-page services-page">
      <section class="admin-dashboard-hero" aria-labelledby="services-title">
        <div>
          <p class="admin-eyebrow">Offre professionnelle</p>
          <h1 id="services-title">Services et méthode de travail</h1>
          <p>
            Administrez une offre crédible, sans tarifs fictifs ni promesses garanties, et expliquez
            clairement les étapes d'une collaboration.
          </p>
        </div>
        <p-tag value="Services 5.7" severity="success" />
      </section>

      @if (loading()) {
        <section class="admin-section" aria-live="polite">Chargement des services...</section>
      } @else if (loadError()) {
        <section class="admin-section admin-form-message admin-form-message--error">
          {{ loadError() }}
        </section>
      } @else {
        <section class="admin-section" aria-labelledby="service-list-title">
          <div class="admin-section__header">
            <div>
              <p class="admin-eyebrow">Services</p>
              <h2 id="service-list-title">Services professionnels</h2>
            </div>
            <p-button label="Créer" icon="pi pi-plus" size="small" (onClick)="openServiceDialog()" />
          </div>

          <div class="admin-filter-bar" aria-label="Filtres services">
            <label for="service-status-filter">
              <span>Statut</span>
              <p-select
                inputId="service-status-filter"
                [options]="statusOptions()"
                optionLabel="label"
                optionValue="value"
                [showClear]="true"
                placeholder="Tous"
                [formControl]="statusFilter"
              />
            </label>
            <label for="service-featured-filter">
              <span>Mise en avant</span>
              <p-select
                inputId="service-featured-filter"
                [options]="featuredOptions"
                optionLabel="label"
                optionValue="value"
                [showClear]="true"
                placeholder="Tous"
                [formControl]="featuredFilter"
              />
            </label>
            <p-button label="Filtrer" icon="pi pi-filter" size="small" (onClick)="loadServices()" />
          </div>

          @if (services().length) {
            <p-table [value]="services()" [paginator]="services().length > 8" [rows]="8" styleClass="admin-prime-table" responsiveLayout="stack">
              <ng-template pTemplate="header">
                <tr>
                  <th>Service</th>
                  <th>Statut</th>
                  <th>Mise en avant</th>
                  <th>Technologies</th>
                  <th>Ordre</th>
                  <th>Actions</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-item let-rowIndex="rowIndex">
                <tr>
                  <td>
                    <strong><i [class]="item.icon || 'pi pi-sitemap'" aria-hidden="true"></i> {{ item.title }}</strong>
                    <p>{{ item.slug || 'Slug non défini' }}</p>
                  </td>
                  <td><p-tag [value]="statusLabel(item.publicationStatus)" [severity]="statusSeverity(item.publicationStatus)" /></td>
                  <td>{{ item.featured ? 'Oui' : 'Non' }}</td>
                  <td>
                    @if (item.technologies.length) {
                      <span>{{ referenceNames(item.technologies) }}</span>
                    } @else {
                      <span>Non renseigné</span>
                    }
                  </td>
                  <td>{{ item.displayOrder }}</td>
                  <td class="admin-table-actions">
                    <p-button icon="pi pi-arrow-up" label="Monter" size="small" severity="secondary" [disabled]="rowIndex === 0" (onClick)="moveService(rowIndex, -1)" />
                    <p-button icon="pi pi-arrow-down" label="Descendre" size="small" severity="secondary" [disabled]="rowIndex === services().length - 1" (onClick)="moveService(rowIndex, 1)" />
                    <p-button icon="pi pi-pencil" label="Modifier" size="small" severity="secondary" (onClick)="openServiceDialog(item)" />
                    @if (item.publicationStatus !== 'PUBLISHED') {
                      <p-button icon="pi pi-eye" label="Publier" size="small" severity="success" (onClick)="publishService(item)" />
                    } @else {
                      <p-button icon="pi pi-eye-slash" label="Dépublier" size="small" severity="secondary" (onClick)="unpublishService(item)" />
                    }
                    @if (item.publicationStatus !== 'ARCHIVED') {
                      <p-button icon="pi pi-box" label="Archiver" size="small" severity="secondary" (onClick)="archiveService(item)" />
                    }
                  </td>
                </tr>
              </ng-template>
            </p-table>
          } @else {
            <app-admin-empty-state
              icon="pi pi-sitemap"
              title="Aucun service"
              description="Créez un service avant de le publier sur le portfolio."
            />
          }
        </section>

        <section class="admin-section" aria-labelledby="work-process-title">
          <div class="admin-section__header">
            <div>
              <p class="admin-eyebrow">Méthode</p>
              <h2 id="work-process-title">Étapes de collaboration</h2>
            </div>
            <p-button label="Ajouter une étape" icon="pi pi-plus" size="small" (onClick)="openStepDialog()" />
          </div>

          @if (steps().length) {
            <p-table [value]="steps()" styleClass="admin-prime-table" responsiveLayout="stack">
              <ng-template pTemplate="header">
                <tr><th>Étape</th><th>Statut</th><th>Ordre</th><th>Actions</th></tr>
              </ng-template>
              <ng-template pTemplate="body" let-step let-rowIndex="rowIndex">
                <tr>
                  <td><strong><i [class]="step.icon || 'pi pi-circle'" aria-hidden="true"></i> {{ stepTitle(step) }}</strong></td>
                  <td><p-tag [value]="statusLabel(step.publicationStatus)" [severity]="statusSeverity(step.publicationStatus)" /></td>
                  <td>{{ step.displayOrder }}</td>
                  <td class="admin-table-actions">
                    <p-button icon="pi pi-arrow-up" label="Monter" size="small" severity="secondary" [disabled]="rowIndex === 0" (onClick)="moveStep(rowIndex, -1)" />
                    <p-button icon="pi pi-arrow-down" label="Descendre" size="small" severity="secondary" [disabled]="rowIndex === steps().length - 1" (onClick)="moveStep(rowIndex, 1)" />
                    <p-button icon="pi pi-pencil" label="Modifier" size="small" severity="secondary" (onClick)="openStepDialog(step)" />
                    @if (step.publicationStatus !== 'PUBLISHED') {
                      <p-button icon="pi pi-eye" label="Publier" size="small" severity="success" (onClick)="publishStep(step)" />
                    } @else {
                      <p-button icon="pi pi-eye-slash" label="Dépublier" size="small" severity="secondary" (onClick)="unpublishStep(step)" />
                    }
                    @if (step.publicationStatus !== 'ARCHIVED') {
                      <p-button icon="pi pi-box" label="Archiver" size="small" severity="secondary" (onClick)="archiveStep(step)" />
                    }
                  </td>
                </tr>
              </ng-template>
            </p-table>
          } @else {
            <app-admin-empty-state
              icon="pi pi-list-check"
              title="Méthode vide"
              description="La section publique sera masquée tant qu'aucune étape publiée n'existe."
            />
          }
        </section>
      }
    </div>

    <p-dialog
      [modal]="true"
      [visible]="serviceDialogVisible()"
      (visibleChange)="serviceDialogVisible.set($event)"
      [draggable]="false"
      [resizable]="false"
      styleClass="admin-form-dialog admin-form-dialog--wide"
      header="Service professionnel"
    >
      @if (serviceForm(); as form) {
        <form class="admin-form admin-form--dialog" [formGroup]="form" (ngSubmit)="saveService()">
          <div class="admin-dialog-body">
            <section class="admin-form-section">
              <h3>Informations générales</h3>
              <div class="admin-form-grid">
                <label><span>Slug</span><input pInputText formControlName="slug" /></label>
                <label><span>Icône PrimeIcons</span><input pInputText formControlName="icon" /></label>
                <label><span>Visuel externe validé</span><input pInputText formControlName="visualUrl" /></label>
                <label for="service-display-order"><span>Ordre</span><p-inputnumber inputId="service-display-order" formControlName="displayOrder" [min]="0" /></label>
              </div>
            </section>

            <section class="admin-form-section">
              <h3>Contenus traduits</h3>
              <p-tabs value="fr">
                <p-tablist>
                  <p-tab value="fr">Français</p-tab>
                  <p-tab value="en">English</p-tab>
                </p-tablist>
                <p-tabpanels>
                  <p-tabpanel value="fr">
                    <div class="admin-form-grid admin-form-grid--wide" formGroupName="fr">
                      <label><span>Titre</span><input pInputText formControlName="title" /></label>
                      <label><span>Résumé</span><textarea pTextarea formControlName="summary" rows="3"></textarea></label>
                      <label><span>Description</span><textarea pTextarea formControlName="description" rows="5"></textarea></label>
                      <label><span>Problème résolu</span><textarea pTextarea formControlName="problem" rows="4"></textarea></label>
                      <label><span>Public cible</span><textarea pTextarea formControlName="targetAudience" rows="3"></textarea></label>
                      <label><span>Libellé CTA</span><input pInputText formControlName="ctaLabel" /></label>
                    </div>
                  </p-tabpanel>
                  <p-tabpanel value="en">
                    <div class="admin-form-grid admin-form-grid--wide" formGroupName="en">
                      <label><span>Title</span><input pInputText formControlName="title" /></label>
                      <label><span>Summary</span><textarea pTextarea formControlName="summary" rows="3"></textarea></label>
                      <label><span>Description</span><textarea pTextarea formControlName="description" rows="5"></textarea></label>
                      <label><span>Problem solved</span><textarea pTextarea formControlName="problem" rows="4"></textarea></label>
                      <label><span>Target audience</span><textarea pTextarea formControlName="targetAudience" rows="3"></textarea></label>
                      <label><span>CTA label</span><input pInputText formControlName="ctaLabel" /></label>
                    </div>
                  </p-tabpanel>
                </p-tabpanels>
              </p-tabs>
            </section>

            <section class="admin-form-section">
              <div class="admin-section__header">
                <h3>Bénéfices</h3>
                <p-button type="button" label="Ajouter" icon="pi pi-plus" size="small" severity="secondary" (onClick)="addBenefit()" />
              </div>
              <div formArrayName="benefits" class="admin-dynamic-list">
                @for (item of benefitControls(); track $index; let i = $index) {
                  <div class="admin-dynamic-item" [formGroupName]="i">
                    <div class="admin-form-grid">
                      <label><span>Libellé FR</span><input pInputText formControlName="labelFr" /></label>
                      <label><span>Label EN</span><input pInputText formControlName="labelEn" /></label>
                      <label [for]="'benefit-order-' + i"><span>Ordre</span><p-inputnumber [inputId]="'benefit-order-' + i" formControlName="displayOrder" [min]="0" /></label>
                      <label class="admin-toggle-field" [for]="'benefit-active-' + i"><span>Actif</span><p-toggleswitch [inputId]="'benefit-active-' + i" formControlName="active" /></label>
                      <label><span>Description FR</span><textarea pTextarea formControlName="descriptionFr" rows="2"></textarea></label>
                      <label><span>Description EN</span><textarea pTextarea formControlName="descriptionEn" rows="2"></textarea></label>
                    </div>
                    <p-button type="button" label="Supprimer" icon="pi pi-trash" size="small" severity="danger" (onClick)="removeBenefit(i)" />
                  </div>
                }
              </div>
            </section>

            <section class="admin-form-section">
              <div class="admin-section__header">
                <h3>Livrables</h3>
                <p-button type="button" label="Ajouter" icon="pi pi-plus" size="small" severity="secondary" (onClick)="addDeliverable()" />
              </div>
              <div formArrayName="deliverables" class="admin-dynamic-list">
                @for (item of deliverableControls(); track $index; let i = $index) {
                  <div class="admin-dynamic-item" [formGroupName]="i">
                    <div class="admin-form-grid">
                      <label><span>Libellé FR</span><input pInputText formControlName="labelFr" /></label>
                      <label><span>Label EN</span><input pInputText formControlName="labelEn" /></label>
                      <label [for]="'deliverable-order-' + i"><span>Ordre</span><p-inputnumber [inputId]="'deliverable-order-' + i" formControlName="displayOrder" [min]="0" /></label>
                      <label class="admin-toggle-field" [for]="'deliverable-active-' + i"><span>Actif</span><p-toggleswitch [inputId]="'deliverable-active-' + i" formControlName="active" /></label>
                      <label><span>Description FR</span><textarea pTextarea formControlName="descriptionFr" rows="2"></textarea></label>
                      <label><span>Description EN</span><textarea pTextarea formControlName="descriptionEn" rows="2"></textarea></label>
                    </div>
                    <p-button type="button" label="Supprimer" icon="pi pi-trash" size="small" severity="danger" (onClick)="removeDeliverable(i)" />
                  </div>
                }
              </div>
            </section>

            <section class="admin-form-section">
              <h3>Technologies et compétences</h3>
              <div class="admin-form-grid">
                <label for="service-technologies">
                  <span>Technologies liées</span>
                  <p-multiselect
                    inputId="service-technologies"
                    [options]="skillOptions()"
                    optionLabel="name"
                    optionValue="id"
                    display="chip"
                    formControlName="technologyIds"
                  />
                </label>
                <label for="service-skills">
                  <span>Compétences mobilisées</span>
                  <p-multiselect
                    inputId="service-skills"
                    [options]="skillOptions()"
                    optionLabel="name"
                    optionValue="id"
                    display="chip"
                    formControlName="skillIds"
                  />
                </label>
              </div>
            </section>

            <section class="admin-form-section">
              <h3>Appel à l'action et publication</h3>
              <div class="admin-form-grid">
                <label for="service-cta-type">
                  <span>Type CTA</span>
                  <p-select
                    inputId="service-cta-type"
                    [options]="ctaOptions()"
                    optionLabel="label"
                    optionValue="value"
                    [showClear]="true"
                    formControlName="ctaType"
                  />
                </label>
                <label><span>Cible CTA</span><input pInputText formControlName="ctaTarget" /></label>
                <label class="admin-toggle-field" for="service-featured"><span>Mise en avant</span><p-toggleswitch inputId="service-featured" formControlName="featured" /></label>
                <div class="admin-field">
                  <span>Statut actuel</span>
                  <p-tag [value]="statusLabel(form.controls.publicationStatus.value)" [severity]="statusSeverity(form.controls.publicationStatus.value)" />
                </div>
              </div>
            </section>
          </div>

          <ng-template pTemplate="footer">
            <div class="admin-dialog-footer">
              <p-button type="button" label="Annuler" icon="pi pi-times" severity="secondary" (onClick)="closeServiceDialog()" />
              <p-button type="submit" label="Enregistrer" icon="pi pi-save" [disabled]="form.invalid || saving()" />
            </div>
          </ng-template>
        </form>
      }
    </p-dialog>

    <p-dialog
      [modal]="true"
      [visible]="stepDialogVisible()"
      (visibleChange)="stepDialogVisible.set($event)"
      [draggable]="false"
      [resizable]="false"
      styleClass="admin-form-dialog"
      header="Étape de méthode"
    >
      @if (stepForm(); as form) {
        <form class="admin-form admin-form--dialog" [formGroup]="form" (ngSubmit)="saveStep()">
          <div class="admin-dialog-body">
            <section class="admin-form-section">
              <div class="admin-form-grid">
                <label for="step-display-order"><span>Ordre</span><p-inputnumber inputId="step-display-order" formControlName="displayOrder" [min]="0" /></label>
                <label><span>Icône</span><input pInputText formControlName="icon" /></label>
                <div class="admin-field">
                  <span>Statut actuel</span>
                  <p-tag [value]="statusLabel(form.controls.publicationStatus.value)" [severity]="statusSeverity(form.controls.publicationStatus.value)" />
                </div>
              </div>
            </section>

            <section class="admin-form-section">
              <p-tabs value="fr">
                <p-tablist>
                  <p-tab value="fr">Français</p-tab>
                  <p-tab value="en">English</p-tab>
                </p-tablist>
                <p-tabpanels>
                  <p-tabpanel value="fr">
                    <div class="admin-form-grid admin-form-grid--wide">
                      <label><span>Titre</span><input pInputText formControlName="titleFr" /></label>
                      <label><span>Description</span><textarea pTextarea formControlName="descriptionFr" rows="4"></textarea></label>
                      <label><span>Résultat attendu</span><input pInputText formControlName="expectedResultFr" /></label>
                    </div>
                  </p-tabpanel>
                  <p-tabpanel value="en">
                    <div class="admin-form-grid admin-form-grid--wide">
                      <label><span>Title</span><input pInputText formControlName="titleEn" /></label>
                      <label><span>Description</span><textarea pTextarea formControlName="descriptionEn" rows="4"></textarea></label>
                      <label><span>Expected result</span><input pInputText formControlName="expectedResultEn" /></label>
                    </div>
                  </p-tabpanel>
                </p-tabpanels>
              </p-tabs>
            </section>
          </div>

          <ng-template pTemplate="footer">
            <div class="admin-dialog-footer">
              <p-button type="button" label="Annuler" icon="pi pi-times" severity="secondary" (onClick)="closeStepDialog()" />
              <p-button type="submit" label="Enregistrer" icon="pi pi-save" [disabled]="form.invalid || saving()" />
            </div>
          </ng-template>
        </form>
      }
    </p-dialog>
  `,
})
export class ServicesPage {
  private readonly api = inject(ServicesApiService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly services = signal<ServiceAdminSummary[]>([]);
  readonly steps = signal<WorkProcessStep[]>([]);
  readonly metadata = signal<ServiceMetadata | null>(null);
  readonly serviceDialogVisible = signal(false);
  readonly stepDialogVisible = signal(false);
  readonly serviceForm = signal<ServiceForm | null>(null);
  readonly stepForm = signal<WorkProcessStepForm | null>(null);
  readonly statusFilter = new FormControl<PublicationStatus | null>(null);
  readonly featuredFilter = new FormControl<boolean | null>(null);
  readonly featuredOptions: SelectOption<boolean>[] = [
    { label: 'Mis en avant', value: true },
    { label: 'Non mis en avant', value: false },
  ];

  constructor() {
    this.loadAll();
  }

  statusOptions(): SelectOption<PublicationStatus>[] {
    return [...(this.metadata()?.publicationStatuses ?? [])];
  }

  ctaOptions(): SelectOption<ServiceCtaType>[] {
    return [...(this.metadata()?.ctaTypes ?? [])];
  }

  skillOptions(): ServiceReference[] {
    return [...(this.metadata()?.skillOptions ?? [])];
  }

  loadAll(): void {
    this.loading.set(true);
    forkJoin({
      metadata: this.api.metadata(),
      services: this.api.list(this.statusFilter.value, this.featuredFilter.value, 0, 24),
      steps: this.api.steps(),
    }).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: ({ metadata, services, steps }) => {
        this.metadata.set(metadata);
        this.services.set([...services.items]);
        this.steps.set([...steps]);
        this.loadError.set(null);
      },
      error: () => this.loadError.set('Impossible de charger les services et la méthode.'),
    });
  }

  loadServices(): void {
    this.api.list(this.statusFilter.value, this.featuredFilter.value, 0, 24).subscribe({
      next: (response) => this.services.set([...response.items]),
      error: () => this.loadError.set('Impossible de filtrer les services.'),
    });
  }

  openServiceDialog(item?: ServiceAdminSummary): void {
    if (!item) {
      this.serviceForm.set(createServiceForm(null));
      this.serviceDialogVisible.set(true);
      return;
    }
    this.api.detail(item.id).subscribe((detail) => {
      this.serviceForm.set(createServiceForm(detail));
      this.serviceDialogVisible.set(true);
    });
  }

  closeServiceDialog(): void {
    this.serviceDialogVisible.set(false);
    this.serviceForm.set(null);
  }

  saveService(): void {
    const form = this.serviceForm();
    if (!form || form.invalid) {
      form?.markAllAsTouched();
      return;
    }
    const id = form.controls.id.value;
    this.saving.set(true);
    const request = id ? this.api.update(id, servicePayload(form)) : this.api.create(servicePayload(form));
    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.closeServiceDialog();
        this.loadServices();
      },
      error: () => this.loadError.set('Enregistrement du service refusé par le backend.'),
    });
  }

  publishService(item: ServiceAdminSummary): void {
    this.api.publish(item.id).subscribe(() => this.loadServices());
  }

  unpublishService(item: ServiceAdminSummary): void {
    this.api.unpublish(item.id).subscribe(() => this.loadServices());
  }

  archiveService(item: ServiceAdminSummary): void {
    this.api.archive(item.id).subscribe(() => this.loadServices());
  }

  moveService(index: number, delta: number): void {
    const updated = [...this.services()];
    const target = index + delta;
    [updated[index], updated[target]] = [updated[target], updated[index]];
    this.services.set(updated);
    this.api.reorder(updated.map((item) => item.id)).subscribe(() => this.loadServices());
  }

  benefitControls(): readonly ServiceItemForm[] {
    return this.items('benefits').controls;
  }

  deliverableControls(): readonly ServiceItemForm[] {
    return this.items('deliverables').controls;
  }

  addBenefit(): void {
    addEmptyItem(this.items('benefits'));
  }

  addDeliverable(): void {
    addEmptyItem(this.items('deliverables'));
  }

  removeBenefit(index: number): void {
    this.items('benefits').removeAt(index);
  }

  removeDeliverable(index: number): void {
    this.items('deliverables').removeAt(index);
  }

  openStepDialog(step?: WorkProcessStep): void {
    this.stepForm.set(createWorkProcessStepForm(step));
    this.stepDialogVisible.set(true);
  }

  closeStepDialog(): void {
    this.stepDialogVisible.set(false);
    this.stepForm.set(null);
  }

  saveStep(): void {
    const form = this.stepForm();
    if (!form || form.invalid) {
      form?.markAllAsTouched();
      return;
    }
    const id = form.controls.id.value;
    this.saving.set(true);
    const request = id ? this.api.updateStep(id, workProcessStepPayload(form)) : this.api.createStep(workProcessStepPayload(form));
    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.closeStepDialog();
        this.loadSteps();
      },
      error: () => this.loadError.set("Enregistrement de l'étape refusé par le backend."),
    });
  }

  publishStep(step: WorkProcessStep): void {
    this.api.publishStep(step.id).subscribe(() => this.loadSteps());
  }

  unpublishStep(step: WorkProcessStep): void {
    this.api.unpublishStep(step.id).subscribe(() => this.loadSteps());
  }

  archiveStep(step: WorkProcessStep): void {
    this.api.archiveStep(step.id).subscribe(() => this.loadSteps());
  }

  moveStep(index: number, delta: number): void {
    const updated = [...this.steps()];
    const target = index + delta;
    [updated[index], updated[target]] = [updated[target], updated[index]];
    this.steps.set(updated);
    this.api.reorderSteps(updated.map((item) => item.id)).subscribe(() => this.loadSteps());
  }

  loadSteps(): void {
    this.api.steps().subscribe((steps) => this.steps.set([...steps]));
  }

  stepTitle(step: WorkProcessStep): string {
    return step.translations.find((translation) => translation.languageCode === 'fr')?.title ?? 'Étape sans titre';
  }

  referenceNames(items: readonly ServiceReference[]): string {
    return items.map((item) => item.name).join(', ');
  }

  statusLabel(status: PublicationStatus): string {
    return this.statusOptions().find((item) => item.value === status)?.label ?? status;
  }

  statusSeverity(status: PublicationStatus): 'success' | 'warn' | 'secondary' {
    if (status === 'PUBLISHED') {
      return 'success';
    }
    return status === 'DRAFT' ? 'warn' : 'secondary';
  }

  private items(name: 'benefits' | 'deliverables'): FormArray<ServiceItemForm> {
    const form = this.serviceForm();
    if (!form) {
      return new FormArray<ServiceItemForm>([]);
    }
    return form.controls[name];
  }
}
