import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, finalize, forkJoin } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { type FileUploadHandlerEvent } from 'primeng/types/fileupload';

import { PublicationStatus } from '../../profile/models/dto/profile.dto';
import { AdminEmptyStateComponent } from '../../shared/ui/admin-empty-state.component';
import { SelectOption } from '../../../shared/models/select-option.model';
import { SkillsApiService } from '../../skills/api/skills-api.service';
import { ProjectApiService } from '../api/project-api.service';
import { Project, ProjectLink, ProjectMetadata, ProjectTranslation } from '../models/dto/project.dto';
import { ProjectForm } from '../models/forms/project-form.model';
import { projectFormValue, projectLinksValue, toProjectPayload } from '../mappers/project-form.mapper';

@Component({
  selector: 'app-projects-page',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgTemplateOutlet,
    ButtonModule,
    DatePickerModule,
    DialogModule,
    FileUploadModule,
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
    <div class="admin-content-page projects-page">
      <section class="admin-dashboard-hero" aria-labelledby="projects-title">
        <div>
          <p class="admin-eyebrow">Réalisations</p>
          <h1 id="projects-title">Projets et études de cas</h1>
          <p>
            Présentez uniquement des projets réels, publiables en toute confidentialité et associés
            à vos compétences.
          </p>
        </div>
        <p-tag value="PrimeNG forms" severity="success" />
      </section>

      @if (loading()) {
        <section class="admin-section" aria-live="polite">Chargement des projets...</section>
      } @else if (loadError()) {
        <section class="admin-section admin-form-message admin-form-message--error">
          {{ loadError() }}
        </section>
      } @else {
        <section class="admin-section" aria-labelledby="project-list-title">
          <div class="admin-section__header">
            <div>
              <p class="admin-eyebrow">Portefeuille</p>
              <h2 id="project-list-title">Projets</h2>
            </div>
            <p-button label="Ajouter un projet" icon="pi pi-plus" size="small" (onClick)="openProjectDialog()" />
          </div>
          <div class="admin-filter-bar" aria-label="Filtres projets">
            <label for="project-status-filter">
              <span>Statut</span>
              <p-select
                inputId="project-status-filter"
                [options]="statusOptions()"
                optionLabel="label"
                optionValue="value"
                [showClear]="true"
                placeholder="Tous les statuts"
                [formControl]="statusFilter"
              />
            </label>
            <p-button label="Appliquer" icon="pi pi-filter" size="small" (onClick)="loadProjects()" />
          </div>
          <p-table [value]="projects()" [paginator]="projects().length > 8" [rows]="8" styleClass="admin-prime-table" responsiveLayout="stack">
            <ng-template pTemplate="header">
              <tr><th>Projet</th><th>Type</th><th>Statut</th><th>Confidentialité</th><th>Mis en avant</th><th>Actions</th></tr>
            </ng-template>
            <ng-template pTemplate="body" let-project>
              <tr>
                <td><strong>{{ titleFor(project.translations) }}</strong><p>{{ project.slug }}</p></td>
                <td>{{ typeLabel(project.projectType) }}</td>
                <td><p-tag [value]="statusLabel(project.publicationStatus)" [severity]="statusSeverity(project.publicationStatus)" /></td>
                <td>{{ confidentialityLabel(project.confidentiality) }}</td>
                <td>{{ project.featured ? 'Oui' : 'Non' }}</td>
                <td class="admin-table-actions">
                  <p-button icon="pi pi-pencil" label="Modifier" size="small" severity="secondary" (onClick)="openProjectDialog(project)" />
                  @if (project.publicationStatus !== 'PUBLISHED') {
                    <p-button icon="pi pi-eye" label="Publier" size="small" severity="success" (onClick)="publish(project)" />
                  } @else {
                    <p-button icon="pi pi-eye-slash" label="Dépublier" size="small" severity="secondary" (onClick)="unpublish(project)" />
                  }
                  @if (project.publicationStatus !== 'ARCHIVED') {
                    <p-button icon="pi pi-box" label="Archiver" size="small" severity="secondary" (onClick)="archive(project)" />
                  }
                  <p-button icon="pi pi-trash" label="Supprimer" size="small" severity="danger" (onClick)="deleteProject(project)" />
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr><td colspan="6"><app-admin-empty-state title="Aucun projet" description="Ajoutez uniquement des projets réels et publiables." icon="pi pi-folder-open" titleId="project-empty" /></td></tr>
            </ng-template>
          </p-table>
        </section>
      }
    </div>

    <p-dialog
      [header]="dialogTitle()"
      [visible]="dialogOpen()"
      (visibleChange)="onDialogVisibility($event)"
      [modal]="true"
      styleClass="admin-dialog admin-dialog--wide"
    >
      @if (dialogOpen()) {
        <form class="admin-dialog-form" [formGroup]="projectForm" (ngSubmit)="saveProject()">
          <section class="admin-form-section">
            <div class="admin-form-section__header">
              <h3>Informations générales</h3>
              <p>Identifiant public, typologie, statut réel et publication du projet.</p>
            </div>
            <div class="admin-form-grid">
              <label for="project-slug"><span>Slug</span><input id="project-slug" pInputText formControlName="slug" placeholder="mon-projet" /></label>
              <label for="project-status"><span>Statut de publication</span><p-select inputId="project-status" formControlName="publicationStatus" [options]="statusOptions()" optionLabel="label" optionValue="value" /></label>
              <label for="project-type"><span>Type</span><p-select inputId="project-type" formControlName="projectType" [options]="metadata().projectTypes" optionLabel="label" optionValue="value" /></label>
              <label for="project-real-status"><span>Avancement</span><p-select inputId="project-real-status" formControlName="realStatus" [options]="metadata().realStatuses" optionLabel="label" optionValue="value" /></label>
              <label for="project-confidentiality"><span>Confidentialité</span><p-select inputId="project-confidentiality" formControlName="confidentiality" [options]="metadata().confidentialityLevels" optionLabel="label" optionValue="value" /></label>
              <label for="project-order"><span>Ordre</span><p-inputnumber inputId="project-order" formControlName="displayOrder" [min]="0" /></label>
              <label for="project-start"><span>Date de début</span><p-datepicker inputId="project-start" formControlName="startDate" dateFormat="yy-mm-dd" [showIcon]="true" /></label>
              <label for="project-end"><span>Date de fin</span><p-datepicker inputId="project-end" formControlName="endDate" dateFormat="yy-mm-dd" [showIcon]="true" /></label>
              <label for="project-skills" class="admin-field--full"><span>Compétences associées</span><p-multiselect inputId="project-skills" formControlName="skillIds" [options]="skillOptions()" optionLabel="label" optionValue="value" [filter]="true" placeholder="Associer des compétences" emptyMessage="Aucune compétence disponible" /></label>
              <label for="project-demo"><span>URL démo</span><input id="project-demo" pInputText formControlName="demoUrl" placeholder="https://..." /></label>
              <label for="project-github"><span>URL dépôt</span><input id="project-github" pInputText formControlName="githubUrl" placeholder="https://..." /></label>
              <label class="admin-toggle-row" for="project-ongoing"><span>En cours<small>Désactive la date de fin.</small></span><p-toggleswitch inputId="project-ongoing" formControlName="ongoing" (onChange)="syncProjectDates()" /></label>
              <label class="admin-toggle-row" for="project-featured"><span>Mettre en avant<small>Affiche ce projet parmi les projets vedettes.</small></span><p-toggleswitch inputId="project-featured" formControlName="featured" /></label>
              <label class="admin-toggle-row admin-field--full" for="project-indexable"><span>Indexable<small>Autorise le référencement de la page publique.</small></span><p-toggleswitch inputId="project-indexable" formControlName="indexable" /></label>
            </div>
          </section>

          <section class="admin-form-section">
            <div class="admin-form-section__header">
              <h3>Contenu traduit</h3>
              <p>Contexte, problème, solution et résultats restent lisibles dans un onglet par langue.</p>
            </div>
            <p-tabs value="fr" class="admin-language-tabs">
              <p-tablist>
                <p-tab value="fr">Français</p-tab>
                <p-tab value="en">English</p-tab>
              </p-tablist>
              <p-tabpanels>
                <p-tabpanel value="fr">
                  <div class="admin-form-grid">
                    <label><span>Titre</span><input pInputText formControlName="titleFr" /></label>
                    <label><span>Titre SEO</span><input pInputText formControlName="seoTitleFr" /></label>
                    <label class="admin-field--full"><span>Résumé</span><textarea pTextarea formControlName="summaryFr" rows="3"></textarea></label>
                    <label class="admin-field--full"><span>Description SEO</span><textarea pTextarea formControlName="seoDescriptionFr" rows="2"></textarea></label>
                    <label class="admin-field--full"><span>Description</span><textarea pTextarea formControlName="descriptionFr" rows="4"></textarea></label>
                    <label><span>Contexte</span><textarea pTextarea formControlName="contextFr" rows="3"></textarea></label>
                    <label><span>Problème</span><textarea pTextarea formControlName="problemFr" rows="3"></textarea></label>
                    <label><span>Objectifs</span><textarea pTextarea formControlName="objectivesFr" rows="3"></textarea></label>
                    <label><span>Utilisateurs cibles</span><textarea pTextarea formControlName="targetUsersFr" rows="3"></textarea></label>
                    <label><span>Rôle</span><textarea pTextarea formControlName="roleFr" rows="3"></textarea></label>
                    <label><span>Responsabilités</span><textarea pTextarea formControlName="responsibilitiesFr" rows="3"></textarea></label>
                    <label><span>Solution</span><textarea pTextarea formControlName="solutionFr" rows="4"></textarea></label>
                    <label><span>Notes d'architecture</span><textarea pTextarea formControlName="architectureNotesFr" rows="4"></textarea></label>
                    <label><span>Fonctionnalités</span><textarea pTextarea formControlName="featuresFr" rows="4"></textarea></label>
                    <label><span>Défis</span><textarea pTextarea formControlName="challengesFr" rows="3"></textarea></label>
                    <label><span>Décisions</span><textarea pTextarea formControlName="decisionsFr" rows="3"></textarea></label>
                    <label><span>Résultats</span><textarea pTextarea formControlName="resultsFr" rows="3"></textarea></label>
                  </div>
                </p-tabpanel>
                <p-tabpanel value="en">
                  <div class="admin-form-grid">
                    <label><span>Title</span><input pInputText formControlName="titleEn" /></label>
                    <label><span>SEO title</span><input pInputText formControlName="seoTitleEn" /></label>
                    <label class="admin-field--full"><span>Summary</span><textarea pTextarea formControlName="summaryEn" rows="3"></textarea></label>
                    <label class="admin-field--full"><span>SEO description</span><textarea pTextarea formControlName="seoDescriptionEn" rows="2"></textarea></label>
                    <label class="admin-field--full"><span>Description</span><textarea pTextarea formControlName="descriptionEn" rows="4"></textarea></label>
                    <label><span>Context</span><textarea pTextarea formControlName="contextEn" rows="3"></textarea></label>
                    <label><span>Problem</span><textarea pTextarea formControlName="problemEn" rows="3"></textarea></label>
                    <label><span>Objectives</span><textarea pTextarea formControlName="objectivesEn" rows="3"></textarea></label>
                    <label><span>Target users</span><textarea pTextarea formControlName="targetUsersEn" rows="3"></textarea></label>
                    <label><span>Role</span><textarea pTextarea formControlName="roleEn" rows="3"></textarea></label>
                    <label><span>Responsibilities</span><textarea pTextarea formControlName="responsibilitiesEn" rows="3"></textarea></label>
                    <label><span>Solution</span><textarea pTextarea formControlName="solutionEn" rows="4"></textarea></label>
                    <label><span>Architecture notes</span><textarea pTextarea formControlName="architectureNotesEn" rows="4"></textarea></label>
                    <label><span>Features</span><textarea pTextarea formControlName="featuresEn" rows="4"></textarea></label>
                    <label><span>Challenges</span><textarea pTextarea formControlName="challengesEn" rows="3"></textarea></label>
                    <label><span>Decisions</span><textarea pTextarea formControlName="decisionsEn" rows="3"></textarea></label>
                    <label><span>Results</span><textarea pTextarea formControlName="resultsEn" rows="3"></textarea></label>
                  </div>
                </p-tabpanel>
              </p-tabpanels>
            </p-tabs>
          </section>

          <section class="admin-form-section">
            <div class="admin-form-section__header">
              <div>
                <h3>Liens</h3>
                <p>Liens complémentaires affichés sur la page publique (hors démo et dépôt).</p>
              </div>
              <p-button label="Ajouter" icon="pi pi-plus" severity="secondary" type="button" (onClick)="addLink()" />
            </div>
            <div class="admin-list-editor">
              @for (link of links(); track $index; let index = $index) {
                <div class="admin-list-row">
                  <input pInputText aria-label="Libellé du lien" [value]="link.label" (input)="updateLink(index, 'label', eventValue($event))" placeholder="Libellé" />
                  <input pInputText aria-label="URL du lien" [value]="link.url" (input)="updateLink(index, 'url', eventValue($event))" placeholder="https://..." />
                  <p-inputnumber ariaLabel="Ordre" [ngModel]="link.displayOrder" [ngModelOptions]="{ standalone: true }" (ngModelChange)="updateLink(index, 'displayOrder', $event)" [min]="0" />
                  <p-button label="Retirer" icon="pi pi-trash" severity="danger" type="button" (onClick)="removeLink(index)" />
                </div>
              } @empty {
                <p class="admin-muted">Aucun lien complémentaire renseigné.</p>
              }
            </div>
          </section>

          <section class="admin-form-section">
            <div class="admin-form-section__header">
              <h3>Médias</h3>
              <p>La couverture et la galerie ne peuvent être gérées qu'après un premier enregistrement.</p>
            </div>
            @if (editingProject(); as project) {
              <div class="admin-panel">
                <p class="admin-eyebrow">Couverture</p>
                @if (coverMedia(project); as cover) {
                  <img class="admin-media-preview" [src]="cover.url" [alt]="cover.altText || 'Couverture du projet'" />
                  <p class="admin-muted">{{ cover.originalFilename }}</p>
                  <p-button label="Supprimer" icon="pi pi-trash" severity="danger" type="button" (onClick)="deleteMedia(project, cover.id)" />
                } @else {
                  <p class="admin-muted">Aucune couverture téléversée.</p>
                }
                <p-fileupload
                  mode="basic"
                  styleClass="admin-file-upload"
                  chooseLabel="Téléverser une couverture"
                  chooseIcon="pi pi-upload"
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  [auto]="true"
                  [customUpload]="true"
                  [maxFileSize]="4194304"
                  (uploadHandler)="uploadCover($event, project)"
                />
              </div>
              <div class="admin-panel">
                <p class="admin-eyebrow">Galerie</p>
                <div class="admin-list-editor">
                  @for (item of galleryMedia(project); track item.id; let index = $index) {
                    <div class="admin-list-row">
                      <img class="admin-media-thumb" [src]="item.url" [alt]="item.altText || 'Média projet'" />
                      <span>{{ item.originalFilename }}</span>
                      <p-button icon="pi pi-arrow-up" severity="secondary" type="button" [disabled]="index === 0" (onClick)="moveGalleryMedia(project, index, -1)" />
                      <p-button icon="pi pi-arrow-down" severity="secondary" type="button" [disabled]="index === galleryMedia(project).length - 1" (onClick)="moveGalleryMedia(project, index, 1)" />
                      <p-button label="Retirer" icon="pi pi-trash" severity="danger" type="button" (onClick)="deleteMedia(project, item.id)" />
                    </div>
                  } @empty {
                    <p class="admin-muted">Aucune image de galerie.</p>
                  }
                </div>
                <p-fileupload
                  mode="basic"
                  styleClass="admin-file-upload"
                  chooseLabel="Ajouter une image à la galerie"
                  chooseIcon="pi pi-upload"
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  [auto]="true"
                  [customUpload]="true"
                  [maxFileSize]="4194304"
                  (uploadHandler)="uploadGalleryImage($event, project)"
                />
              </div>
            } @else {
              <p class="admin-muted">Enregistrez le projet une première fois pour activer la gestion des médias.</p>
            }
          </section>

          <ng-container *ngTemplateOutlet="dialogActions" />
        </form>
      }
    </p-dialog>

    <ng-template #dialogActions>
      @if (formMessage()) {
        <p class="admin-form-message" [class.admin-form-message--error]="messageType() === 'error'">{{ formMessage() }}</p>
      }
      <div class="admin-dialog-actions">
        <p-button label="Fermer" severity="secondary" type="button" (onClick)="closeDialog()" />
        <p-button label="Enregistrer" icon="pi pi-save" type="submit" [disabled]="projectForm.invalid || saving()" />
      </div>
    </ng-template>

    <p-dialog header="Confirmer la suppression" [visible]="deleteTarget() !== null" (visibleChange)="closeDeleteDialog()" [modal]="true" [style]="{ width: 'min(30rem, calc(100vw - 2rem))' }">
      @if (deleteTarget(); as target) {
        <div class="admin-dialog-form">
          <p>Supprimer définitivement <strong>{{ target.label }}</strong> ?</p>
          @if (formMessage()) {
            <p class="admin-form-message admin-form-message--error">{{ formMessage() }}</p>
          }
          <div class="admin-dialog-actions">
            <p-button label="Annuler" severity="secondary" type="button" (onClick)="closeDeleteDialog()" />
            <p-button label="Supprimer" icon="pi pi-trash" severity="danger" type="button" [disabled]="saving()" (onClick)="confirmDelete()" />
          </div>
        </div>
      }
    </p-dialog>

    <p-dialog
      header="Modifications non enregistrées"
      [visible]="unsavedCloseRequested()"
      (visibleChange)="cancelPendingClose()"
      [modal]="true"
      [style]="{ width: 'min(32rem, calc(100vw - 2rem))' }"
    >
      <div class="admin-dialog-form">
        <p>Des modifications sont en cours dans ce formulaire. Confirmez l'abandon pour fermer la modale.</p>
        <div class="admin-dialog-actions">
          <p-button label="Continuer l'édition" severity="secondary" type="button" (onClick)="cancelPendingClose()" />
          <p-button label="Abandonner" icon="pi pi-times" severity="danger" type="button" (onClick)="confirmPendingClose()" />
        </div>
      </div>
    </p-dialog>
  `,
})
export class ProjectsPage {
  private readonly api = inject(ProjectApiService);
  private readonly skillsApi = inject(SkillsApiService);
  private initialDialogFormValue = '';

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly formMessage = signal<string | null>(null);
  readonly messageType = signal<'success' | 'error'>('error');
  readonly projects = signal<Project[]>([]);
  readonly skillOptions = signal<SelectOption<string>[]>([]);
  readonly metadata = signal<ProjectMetadata>({
    publicationStatuses: [],
    projectTypes: [],
    realStatuses: [],
    confidentialityLevels: [],
  });
  readonly links = signal<ProjectLink[]>([]);
  readonly editingProject = signal<Project | null>(null);
  readonly dialogOpen = signal(false);
  readonly deleteTarget = signal<{ readonly id: string; readonly label: string } | null>(null);
  readonly unsavedCloseRequested = signal(false);
  readonly statusFilter = new FormControl<PublicationStatus | null>(null);
  readonly statusOptions = signal<SelectOption<PublicationStatus>[]>([]);

  readonly projectForm: ProjectForm = new FormGroup({
    id: new FormControl<string | null>(null),
    slug: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(160), Validators.pattern(/^[a-z0-9]+(-[a-z0-9]+)*$/)],
    }),
    projectType: new FormControl<Project['projectType']>('SAAS_APPLICATION', { nonNullable: true }),
    realStatus: new FormControl<Project['realStatus']>('IN_PROGRESS', { nonNullable: true }),
    publicationStatus: new FormControl<PublicationStatus>('DRAFT', { nonNullable: true }),
    confidentiality: new FormControl<Project['confidentiality']>('PUBLIC', { nonNullable: true }),
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
    ongoing: new FormControl(false, { nonNullable: true }),
    featured: new FormControl(false, { nonNullable: true }),
    displayOrder: new FormControl(10, { nonNullable: true, validators: [Validators.min(0)] }),
    demoUrl: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(500)] }),
    githubUrl: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(500)] }),
    indexable: new FormControl(true, { nonNullable: true }),
    skillIds: new FormControl<string[]>([], { nonNullable: true }),
    titleFr: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(220)] }),
    summaryFr: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(800)] }),
    descriptionFr: new FormControl('', { nonNullable: true }),
    contextFr: new FormControl('', { nonNullable: true }),
    problemFr: new FormControl('', { nonNullable: true }),
    objectivesFr: new FormControl('', { nonNullable: true }),
    targetUsersFr: new FormControl('', { nonNullable: true }),
    roleFr: new FormControl('', { nonNullable: true }),
    responsibilitiesFr: new FormControl('', { nonNullable: true }),
    solutionFr: new FormControl('', { nonNullable: true }),
    architectureNotesFr: new FormControl('', { nonNullable: true }),
    featuresFr: new FormControl('', { nonNullable: true }),
    challengesFr: new FormControl('', { nonNullable: true }),
    decisionsFr: new FormControl('', { nonNullable: true }),
    resultsFr: new FormControl('', { nonNullable: true }),
    seoTitleFr: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(70)] }),
    seoDescriptionFr: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(160)] }),
    titleEn: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(220)] }),
    summaryEn: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(800)] }),
    descriptionEn: new FormControl('', { nonNullable: true }),
    contextEn: new FormControl('', { nonNullable: true }),
    problemEn: new FormControl('', { nonNullable: true }),
    objectivesEn: new FormControl('', { nonNullable: true }),
    targetUsersEn: new FormControl('', { nonNullable: true }),
    roleEn: new FormControl('', { nonNullable: true }),
    responsibilitiesEn: new FormControl('', { nonNullable: true }),
    solutionEn: new FormControl('', { nonNullable: true }),
    architectureNotesEn: new FormControl('', { nonNullable: true }),
    featuresEn: new FormControl('', { nonNullable: true }),
    challengesEn: new FormControl('', { nonNullable: true }),
    decisionsEn: new FormControl('', { nonNullable: true }),
    resultsEn: new FormControl('', { nonNullable: true }),
    seoTitleEn: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(70)] }),
    seoDescriptionEn: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(160)] }),
  });

  constructor() {
    this.loadAll();
  }

  dialogTitle(): string {
    return this.projectForm.controls.id.value ? 'Modifier le projet' : 'Créer un projet';
  }

  loadAll(): void {
    this.loading.set(true);
    this.loadError.set(null);
    forkJoin({
      projects: this.api.list(this.statusFilter.value ?? undefined),
      metadata: this.api.metadata(),
      skills: this.skillsApi.getSkills(),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ projects, metadata, skills }) => {
          this.projects.set([...projects.items]);
          this.metadata.set(metadata);
          this.statusOptions.set(metadata.publicationStatuses);
          this.skillOptions.set(
            skills.map((skill) => ({
              label: `${skill.translations.find((item) => item.languageCode === 'fr')?.name ?? 'Compétence'} · ${skill.categoryNameFr}`,
              value: skill.id,
              disabled: skill.publicationStatus === 'ARCHIVED',
            })),
          );
        },
        error: () => this.loadError.set('Impossible de charger les projets.'),
      });
  }

  loadProjects(): void {
    this.api.list(this.statusFilter.value ?? undefined).subscribe({
      next: (page) => this.projects.set([...page.items]),
      error: () => this.loadError.set("Impossible d'appliquer les filtres."),
    });
  }

  openProjectDialog(project: Project | null = null): void {
    this.formMessage.set(null);
    this.messageType.set('error');
    this.editingProject.set(project);
    this.links.set(projectLinksValue(project));
    this.projectForm.reset(projectFormValue(project, this.nextOrder(this.projects())));
    this.syncProjectDates();
    this.initialDialogFormValue = this.formSnapshot();
    this.dialogOpen.set(true);
  }

  saveProject(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      this.messageType.set('error');
      this.formMessage.set('Vérifiez les champs requis, notamment le slug.');
      return;
    }
    const id = this.projectForm.controls.id.value;
    const payload = toProjectPayload(this.projectForm, this.links());
    const request = id ? this.api.update(id, payload) : this.api.create(payload);
    this.saving.set(true);
    this.formMessage.set(null);
    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: (project) => {
        this.editingProject.set(project);
        this.links.set(projectLinksValue(project));
        this.projectForm.patchValue(projectFormValue(project, project.displayOrder));
        this.initialDialogFormValue = this.formSnapshot();
        this.messageType.set('success');
        this.formMessage.set('Projet enregistré.');
        this.loadProjects();
      },
      error: () => {
        this.messageType.set('error');
        this.formMessage.set("Le projet n'a pas pu être enregistré.");
      },
    });
  }

  addLink(): void {
    this.links.update((links) => [
      ...links,
      { id: null, label: '', url: '', displayOrder: links.length * 10 },
    ]);
    this.projectForm.markAsDirty();
  }

  removeLink(index: number): void {
    this.links.update((links) => links.filter((_, linkIndex) => linkIndex !== index));
    this.projectForm.markAsDirty();
  }

  updateLink<K extends keyof ProjectLink>(index: number, key: K, value: ProjectLink[K]): void {
    this.links.update((links) =>
      links.map((link, linkIndex) => (linkIndex === index ? { ...link, [key]: value } : link)),
    );
    this.projectForm.markAsDirty();
  }

  eventValue(event: Event): string {
    return event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement
      ? event.target.value
      : '';
  }

  coverMedia(project: Project) {
    return project.media.find((media) => media.kind === 'COVER') ?? null;
  }

  galleryMedia(project: Project) {
    return project.media.filter((media) => media.kind === 'GALLERY');
  }

  uploadCover(event: FileUploadHandlerEvent, project: Project): void {
    const file = this.firstFile(event);
    if (!file) {
      return;
    }
    this.api.uploadMedia(project.id, file, 'COVER').subscribe({
      next: (updated) => this.applyEditingProject(updated),
      error: () => this.setMediaError("La couverture n'a pas pu être téléversée."),
    });
  }

  uploadGalleryImage(event: FileUploadHandlerEvent, project: Project): void {
    const file = this.firstFile(event);
    if (!file) {
      return;
    }
    this.api.uploadMedia(project.id, file, 'GALLERY').subscribe({
      next: (updated) => this.applyEditingProject(updated),
      error: () => this.setMediaError("L'image n'a pas pu être téléversée."),
    });
  }

  deleteMedia(project: Project, mediaId: string): void {
    this.api.deleteMedia(project.id, mediaId).subscribe({
      next: (updated) => this.applyEditingProject(updated),
      error: () => this.setMediaError("Le média n'a pas pu être supprimé."),
    });
  }

  moveGalleryMedia(project: Project, index: number, direction: -1 | 1): void {
    const gallery = this.galleryMedia(project);
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= gallery.length) {
      return;
    }
    const reordered = [...gallery];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    this.api.reorderGalleryMedia(project.id, reordered.map((media) => media.id)).subscribe({
      next: (updated) => this.applyEditingProject(updated),
      error: () => this.setMediaError("L'ordre de la galerie n'a pas pu être mis à jour."),
    });
  }

  deleteProject(project: Project): void {
    this.deleteTarget.set({ id: project.id, label: this.titleFor(project.translations) });
  }

  confirmDelete(): void {
    const target = this.deleteTarget();
    if (!target) {
      return;
    }
    this.saving.set(true);
    this.formMessage.set(null);
    this.api
      .delete(target.id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.deleteTarget.set(null);
          this.loadProjects();
        },
        error: () => {
          this.messageType.set('error');
          this.formMessage.set("Le projet n'a pas pu être supprimé.");
        },
      });
  }

  publish(project: Project): void {
    this.runWorkflowAction(this.api.publish(project.id));
  }

  unpublish(project: Project): void {
    this.runWorkflowAction(this.api.unpublish(project.id));
  }

  archive(project: Project): void {
    this.runWorkflowAction(this.api.archive(project.id));
  }

  onDialogVisibility(visible: boolean): void {
    if (!visible) {
      this.closeDialog();
    }
  }

  closeDialog(): void {
    if (this.saving()) {
      return;
    }
    if (this.activeFormDirty()) {
      this.unsavedCloseRequested.set(true);
      return;
    }
    this.forceCloseDialog();
  }

  cancelPendingClose(): void {
    this.unsavedCloseRequested.set(false);
  }

  confirmPendingClose(): void {
    this.unsavedCloseRequested.set(false);
    this.forceCloseDialog();
  }

  closeDeleteDialog(): void {
    if (!this.saving()) {
      this.deleteTarget.set(null);
      this.formMessage.set(null);
    }
  }

  syncProjectDates(): void {
    if (this.projectForm.controls.ongoing.value) {
      this.projectForm.controls.endDate.setValue(null);
      this.projectForm.controls.endDate.disable();
    } else {
      this.projectForm.controls.endDate.enable();
    }
  }

  titleFor(translations: readonly ProjectTranslation[]): string {
    return translations.find((translation) => translation.languageCode === 'fr')?.title?.trim() || 'Sans titre';
  }

  typeLabel(value: Project['projectType']): string {
    return this.metadata().projectTypes.find((option) => option.value === value)?.label ?? value;
  }

  confidentialityLabel(value: Project['confidentiality']): string {
    return this.metadata().confidentialityLevels.find((option) => option.value === value)?.label ?? value;
  }

  statusLabel(status: PublicationStatus): string {
    return this.statusOptions().find((option) => option.value === status)?.label ?? status;
  }

  statusSeverity(status: PublicationStatus): 'success' | 'warn' | 'secondary' {
    if (status === 'PUBLISHED') {
      return 'success';
    }
    if (status === 'DRAFT') {
      return 'warn';
    }
    return 'secondary';
  }

  private runWorkflowAction(request: Observable<Project>): void {
    this.saving.set(true);
    this.formMessage.set(null);
    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => this.loadProjects(),
      error: () => this.loadError.set("L'action n'a pas pu être appliquée."),
    });
  }

  private applyEditingProject(project: Project): void {
    this.editingProject.set(project);
    this.projects.update((projects) => projects.map((item) => (item.id === project.id ? project : item)));
  }

  private setMediaError(message: string): void {
    this.messageType.set('error');
    this.formMessage.set(message);
  }

  private firstFile(event: FileUploadHandlerEvent): File | null {
    return event.files.length ? event.files[0] : null;
  }

  private nextOrder(items: readonly { displayOrder: number }[]): number {
    return Math.max(0, ...items.map((item) => item.displayOrder)) + 10;
  }

  private activeFormDirty(): boolean {
    return this.dialogOpen() && this.initialDialogFormValue !== this.formSnapshot();
  }

  private forceCloseDialog(): void {
    this.dialogOpen.set(false);
    this.editingProject.set(null);
    this.formMessage.set(null);
    this.projectForm.markAsPristine();
    this.initialDialogFormValue = '';
  }

  private formSnapshot(): string {
    return JSON.stringify({ form: this.projectForm.getRawValue(), links: this.links() });
  }
}
