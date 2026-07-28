import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, finalize, forkJoin } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { PublicationStatus } from '../../profile/models/dto/profile.dto';
import { AdminEmptyStateComponent } from '../../shared/ui/admin-empty-state.component';
import { SelectOption } from '../../../shared/models/select-option.model';
import { SkillsApiService } from '../../skills/api/skills-api.service';
import { CareerApiService } from '../api/career-api.service';
import {
  CareerCertification,
  CareerCertificationTranslation,
  CareerEducation,
  CareerEducationTranslation,
  CareerExperience,
  CareerExperienceTranslation,
  CareerMetadata,
} from '../models/dto/career.dto';
import {
  CareerCertificationForm,
  CareerEducationForm,
  CareerExperienceForm,
} from '../models/forms/career-form.model';
import {
  certificationFormValue,
  educationFormValue,
  experienceFormValue,
  toCertificationPayload,
  toEducationPayload,
  toExperiencePayload,
} from '../mappers/career-form.mapper';

type CareerDialog = 'experience' | 'education' | 'certification';
type DeleteTarget =
  | { readonly kind: 'experience'; readonly id: string; readonly label: string }
  | { readonly kind: 'education'; readonly id: string; readonly label: string }
  | { readonly kind: 'certification'; readonly id: string; readonly label: string };

@Component({
  selector: 'app-career-page',
  imports: [
    ReactiveFormsModule,
    NgTemplateOutlet,
    ButtonModule,
    CheckboxModule,
    DatePickerModule,
    DialogModule,
    InputNumberModule,
    InputTextModule,
    MultiSelectModule,
    SelectModule,
    TableModule,
    TagModule,
    TextareaModule,
    ToggleSwitchModule,
    AdminEmptyStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="admin-content-page career-page">
      <section class="admin-dashboard-hero" aria-labelledby="career-title">
        <div>
          <p class="admin-eyebrow">Parcours professionnel</p>
          <h1 id="career-title">Expériences, formations et certifications</h1>
          <p>
            Structurez un parcours crédible, multilingue et publiable sans exposer de données
            confidentielles.
          </p>
        </div>
        <p-tag value="PrimeNG forms" severity="success" />
      </section>

      @if (loading()) {
        <section class="admin-section" aria-live="polite">Chargement du parcours...</section>
      } @else if (loadError()) {
        <section class="admin-section admin-form-message admin-form-message--error">
          {{ loadError() }}
        </section>
      } @else {
        <section class="admin-section" aria-labelledby="experience-list-title">
          <div class="admin-section__header">
            <div>
              <p class="admin-eyebrow">Chronologie</p>
              <h2 id="experience-list-title">Expériences professionnelles</h2>
            </div>
            <p-button label="Ajouter une expérience" icon="pi pi-plus" size="small" (onClick)="openExperienceDialog()" />
          </div>
          <div class="admin-filter-bar" aria-label="Filtres expériences">
            <label for="experience-status-filter">
              <span>Statut</span>
              <p-select
                inputId="experience-status-filter"
                [options]="statusOptions()"
                optionLabel="label"
                optionValue="value"
                [showClear]="true"
                placeholder="Tous les statuts"
                [formControl]="experienceStatusFilter"
              />
            </label>
            <p-button label="Appliquer" icon="pi pi-filter" size="small" (onClick)="loadExperiences()" />
          </div>
          <p-table [value]="experiences()" [paginator]="experiences().length > 6" [rows]="6" styleClass="admin-prime-table" responsiveLayout="stack">
            <ng-template pTemplate="header">
              <tr><th>Poste</th><th>Organisation</th><th>Période</th><th>Statut</th><th>Confidentiel</th><th>Actions</th></tr>
            </ng-template>
            <ng-template pTemplate="body" let-experience>
              <tr>
                <td><strong>{{ experience.roleTitle }}</strong><p>{{ experienceSummary(experience.translations) }}</p></td>
                <td>{{ experience.confidential ? 'Client confidentiel' : experience.organization || 'Non renseigné' }}</td>
                <td>{{ period(experience.startDate, experience.endDate, experience.currentPosition) }}</td>
                <td><p-tag [value]="statusLabel(experience.publicationStatus)" [severity]="statusSeverity(experience.publicationStatus)" /></td>
                <td>{{ experience.confidential ? 'Oui' : 'Non' }}</td>
                <td class="admin-table-actions">
                  <p-button icon="pi pi-pencil" label="Modifier" size="small" severity="secondary" (onClick)="openExperienceDialog(experience)" />
                  <p-button icon="pi pi-trash" label="Supprimer" size="small" severity="danger" (onClick)="deleteExperience(experience)" />
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr><td colspan="6"><app-admin-empty-state title="Aucune expérience" description="Ajoutez uniquement des expériences réelles et publiables." icon="pi pi-briefcase" titleId="experience-empty" /></td></tr>
            </ng-template>
          </p-table>
        </section>

        <section class="admin-section" aria-labelledby="education-list-title">
          <div class="admin-section__header">
            <div><p class="admin-eyebrow">Apprentissage</p><h2 id="education-list-title">Formations</h2></div>
            <p-button label="Ajouter une formation" icon="pi pi-plus" size="small" (onClick)="openEducationDialog()" />
          </div>
          <p-table [value]="education()" [paginator]="education().length > 6" [rows]="6" styleClass="admin-prime-table" responsiveLayout="stack">
            <ng-template pTemplate="header">
              <tr><th>Formation</th><th>Établissement</th><th>Période</th><th>Statut</th><th>Actions</th></tr>
            </ng-template>
            <ng-template pTemplate="body" let-item>
              <tr>
                <td><strong>{{ educationTitle(item.translations) }}</strong><p>{{ educationField(item.translations) }}</p></td>
                <td>{{ item.institution }}</td>
                <td>{{ period(item.startDate, item.endDate, item.currentEducation) }}</td>
                <td><p-tag [value]="statusLabel(item.publicationStatus)" [severity]="statusSeverity(item.publicationStatus)" /></td>
                <td class="admin-table-actions">
                  <p-button icon="pi pi-pencil" label="Modifier" size="small" severity="secondary" (onClick)="openEducationDialog(item)" />
                  <p-button icon="pi pi-trash" label="Supprimer" size="small" severity="danger" (onClick)="deleteEducation(item)" />
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr><td colspan="5"><app-admin-empty-state title="Aucune formation" description="Ajoutez vos formations académiques ou professionnelles réelles." icon="pi pi-graduation-cap" titleId="education-empty" /></td></tr>
            </ng-template>
          </p-table>
        </section>

        <section class="admin-section" aria-labelledby="certification-list-title">
          <div class="admin-section__header">
            <div><p class="admin-eyebrow">Validation externe</p><h2 id="certification-list-title">Certifications</h2></div>
            <p-button label="Ajouter une certification" icon="pi pi-plus" size="small" (onClick)="openCertificationDialog()" />
          </div>
          <p-table [value]="certifications()" [paginator]="certifications().length > 6" [rows]="6" styleClass="admin-prime-table" responsiveLayout="stack">
            <ng-template pTemplate="header">
              <tr><th>Certification</th><th>Organisme</th><th>Validité</th><th>Statut</th><th>Actions</th></tr>
            </ng-template>
            <ng-template pTemplate="body" let-certification>
              <tr>
                <td><strong>{{ certificationName(certification.translations) }}</strong></td>
                <td>{{ certification.issuer }}</td>
                <td>{{ certification.noExpiry ? 'Sans expiration' : period(certification.issueDate, certification.expiryDate, false) }}</td>
                <td><p-tag [value]="statusLabel(certification.publicationStatus)" [severity]="statusSeverity(certification.publicationStatus)" /></td>
                <td class="admin-table-actions">
                  <p-button icon="pi pi-pencil" label="Modifier" size="small" severity="secondary" (onClick)="openCertificationDialog(certification)" />
                  <p-button icon="pi pi-trash" label="Supprimer" size="small" severity="danger" (onClick)="deleteCertification(certification)" />
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr><td colspan="5"><app-admin-empty-state title="Aucune certification" description="Ajoutez uniquement les certifications réellement obtenues." icon="pi pi-verified" titleId="certification-empty" /></td></tr>
            </ng-template>
          </p-table>
        </section>
      }
    </div>

    <p-dialog [header]="dialogTitle()" [visible]="dialogOpen()" (visibleChange)="onDialogVisibility($event)" [modal]="true" [style]="{ width: 'min(68rem, calc(100vw - 2rem))' }">
      @if (activeDialog() === 'experience') {
        <form class="admin-dialog-form" [formGroup]="experienceForm" (ngSubmit)="saveExperience()">
          <div class="admin-form-grid">
            <label for="experience-status"><span>Statut</span><p-select inputId="experience-status" formControlName="publicationStatus" [options]="statusOptions()" optionLabel="label" optionValue="value" /></label>
            <label for="experience-type"><span>Type</span><p-select inputId="experience-type" formControlName="experienceType" [options]="metadata().experienceTypes" optionLabel="label" optionValue="value" /></label>
            <label for="experience-contract"><span>Contrat</span><p-select inputId="experience-contract" formControlName="contractType" [options]="metadata().contractTypes" optionLabel="label" optionValue="value" [showClear]="true" placeholder="Facultatif" /></label>
            <label for="experience-work-mode"><span>Mode</span><p-select inputId="experience-work-mode" formControlName="workMode" [options]="metadata().workModes" optionLabel="label" optionValue="value" /></label>
            <label for="experience-role"><span>Poste</span><input id="experience-role" pInputText formControlName="roleTitle" /></label>
            <label for="experience-org"><span>Entreprise/client</span><input id="experience-org" pInputText formControlName="organization" /></label>
            <label for="experience-location"><span>Localisation</span><input id="experience-location" pInputText formControlName="location" /></label>
            <label for="experience-url"><span>Lien public</span><input id="experience-url" pInputText formControlName="organizationUrl" /></label>
            <label for="experience-start"><span>Date de début</span><p-datepicker inputId="experience-start" formControlName="startDate" dateFormat="yy-mm-dd" [showIcon]="true" /></label>
            <label for="experience-end"><span>Date de fin</span><p-datepicker inputId="experience-end" formControlName="endDate" dateFormat="yy-mm-dd" [showIcon]="true" /></label>
            <label for="experience-skills"><span>Technologies</span><p-multiselect inputId="experience-skills" formControlName="skillIds" [options]="skillOptions()" optionLabel="label" optionValue="value" [filter]="true" placeholder="Associer des compétences" emptyMessage="Aucune compétence disponible" /></label>
            <label for="experience-order"><span>Ordre</span><p-inputnumber inputId="experience-order" formControlName="displayOrder" [min]="0" /></label>
            <label class="admin-toggle-field" for="experience-current"><span>En cours</span><p-toggleswitch inputId="experience-current" formControlName="currentPosition" (onChange)="syncExperienceDates()" /></label>
            <label class="admin-toggle-field" for="experience-confidential"><span>Confidentiel</span><p-checkbox inputId="experience-confidential" formControlName="confidential" [binary]="true" /></label>
          </div>
          <div class="admin-language-grid">
            <fieldset><legend>Français</legend><label><span>Résumé</span><textarea pTextarea formControlName="summaryFr" rows="3"></textarea></label><label><span>Missions</span><textarea pTextarea formControlName="missionsFr" rows="4"></textarea></label><label><span>Réalisations</span><textarea pTextarea formControlName="achievementsFr" rows="4"></textarea></label><label><span>Libellé confidentiel</span><input pInputText formControlName="confidentialLabelFr" /></label></fieldset>
            <fieldset><legend>English</legend><label><span>Summary</span><textarea pTextarea formControlName="summaryEn" rows="3"></textarea></label><label><span>Missions</span><textarea pTextarea formControlName="missionsEn" rows="4"></textarea></label><label><span>Achievements</span><textarea pTextarea formControlName="achievementsEn" rows="4"></textarea></label><label><span>Confidential label</span><input pInputText formControlName="confidentialLabelEn" /></label></fieldset>
          </div>
          <ng-container *ngTemplateOutlet="dialogActions" />
        </form>
      }

      @if (activeDialog() === 'education') {
        <form class="admin-dialog-form" [formGroup]="educationForm" (ngSubmit)="saveEducation()">
          <div class="admin-form-grid">
            <label for="education-status"><span>Statut</span><p-select inputId="education-status" formControlName="publicationStatus" [options]="statusOptions()" optionLabel="label" optionValue="value" /></label>
            <label for="education-level"><span>Niveau</span><p-select inputId="education-level" formControlName="educationLevel" [options]="metadata().educationLevels" optionLabel="label" optionValue="value" [showClear]="true" /></label>
            <label for="education-institution"><span>Établissement</span><input id="education-institution" pInputText formControlName="institution" /></label>
            <label for="education-location"><span>Localisation</span><input id="education-location" pInputText formControlName="location" /></label>
            <label for="education-url"><span>Lien</span><input id="education-url" pInputText formControlName="url" /></label>
            <label for="education-start"><span>Date de début</span><p-datepicker inputId="education-start" formControlName="startDate" dateFormat="yy-mm-dd" [showIcon]="true" /></label>
            <label for="education-end"><span>Date de fin</span><p-datepicker inputId="education-end" formControlName="endDate" dateFormat="yy-mm-dd" [showIcon]="true" /></label>
            <label for="education-order"><span>Ordre</span><p-inputnumber inputId="education-order" formControlName="displayOrder" [min]="0" /></label>
            <label class="admin-toggle-field" for="education-current"><span>En cours</span><p-toggleswitch inputId="education-current" formControlName="currentEducation" (onChange)="syncEducationDates()" /></label>
          </div>
          <div class="admin-language-grid">
            <fieldset><legend>Français</legend><label><span>Intitulé</span><input pInputText formControlName="titleFr" /></label><label><span>Domaine</span><input pInputText formControlName="fieldFr" /></label><label><span>Description</span><textarea pTextarea formControlName="descriptionFr" rows="4"></textarea></label></fieldset>
            <fieldset><legend>English</legend><label><span>Title</span><input pInputText formControlName="titleEn" /></label><label><span>Field</span><input pInputText formControlName="fieldEn" /></label><label><span>Description</span><textarea pTextarea formControlName="descriptionEn" rows="4"></textarea></label></fieldset>
          </div>
          <ng-container *ngTemplateOutlet="dialogActions" />
        </form>
      }

      @if (activeDialog() === 'certification') {
        <form class="admin-dialog-form" [formGroup]="certificationForm" (ngSubmit)="saveCertification()">
          <div class="admin-form-grid">
            <label for="certification-status"><span>Statut</span><p-select inputId="certification-status" formControlName="publicationStatus" [options]="statusOptions()" optionLabel="label" optionValue="value" /></label>
            <label for="certification-issuer"><span>Organisme</span><input id="certification-issuer" pInputText formControlName="issuer" /></label>
            <label for="certification-issue"><span>Date d'obtention</span><p-datepicker inputId="certification-issue" formControlName="issueDate" dateFormat="yy-mm-dd" [showIcon]="true" /></label>
            <label for="certification-expiry"><span>Date d'expiration</span><p-datepicker inputId="certification-expiry" formControlName="expiryDate" dateFormat="yy-mm-dd" [showIcon]="true" /></label>
            <label for="certification-id"><span>Identifiant</span><input id="certification-id" pInputText formControlName="credentialId" /></label>
            <label for="certification-url"><span>URL de vérification</span><input id="certification-url" pInputText formControlName="verificationUrl" /></label>
            <label for="certification-order"><span>Ordre</span><p-inputnumber inputId="certification-order" formControlName="displayOrder" [min]="0" /></label>
            <label class="admin-toggle-field" for="certification-no-expiry"><span>Sans expiration</span><p-toggleswitch inputId="certification-no-expiry" formControlName="noExpiry" (onChange)="syncCertificationDates()" /></label>
          </div>
          <div class="admin-language-grid">
            <fieldset><legend>Français</legend><label><span>Nom</span><input pInputText formControlName="nameFr" /></label><label><span>Description</span><textarea pTextarea formControlName="descriptionFr" rows="4"></textarea></label></fieldset>
            <fieldset><legend>English</legend><label><span>Name</span><input pInputText formControlName="nameEn" /></label><label><span>Description</span><textarea pTextarea formControlName="descriptionEn" rows="4"></textarea></label></fieldset>
          </div>
          <ng-container *ngTemplateOutlet="dialogActions" />
        </form>
      }
    </p-dialog>

    <ng-template #dialogActions>
      @if (formMessage()) {
        <p class="admin-form-message admin-form-message--error">{{ formMessage() }}</p>
      }
      <div class="admin-dialog-actions">
        <p-button label="Annuler" severity="secondary" type="button" (onClick)="closeDialog()" />
        <p-button label="Enregistrer" icon="pi pi-save" type="submit" [disabled]="activeFormInvalid() || saving()" />
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
  `,
})
export class CareerPage {
  private readonly api = inject(CareerApiService);
  private readonly skillsApi = inject(SkillsApiService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly formMessage = signal<string | null>(null);
  readonly experiences = signal<CareerExperience[]>([]);
  readonly education = signal<CareerEducation[]>([]);
  readonly certifications = signal<CareerCertification[]>([]);
  readonly skillOptions = signal<SelectOption<string>[]>([]);
  readonly metadata = signal<CareerMetadata>({
    publicationStatuses: [],
    experienceTypes: [],
    contractTypes: [],
    workModes: [],
    educationLevels: [],
  });
  readonly activeDialog = signal<CareerDialog | null>(null);
  readonly deleteTarget = signal<DeleteTarget | null>(null);
  readonly experienceStatusFilter = new FormControl<PublicationStatus | null>(null);
  readonly statusOptions = computed(() => this.metadata().publicationStatuses);

  readonly experienceForm: CareerExperienceForm = new FormGroup({
    id: new FormControl<string | null>(null),
    publicationStatus: new FormControl<PublicationStatus>('DRAFT', { nonNullable: true }),
    experienceType: new FormControl<CareerExperience['experienceType']>('EMPLOYMENT', {
      nonNullable: true,
    }),
    contractType: new FormControl<CareerExperience['contractType']>(null),
    organization: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(180)] }),
    roleTitle: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(180)] }),
    location: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(180)] }),
    workMode: new FormControl<CareerExperience['workMode']>('HYBRID', { nonNullable: true }),
    startDate: new FormControl<Date | null>(null, { validators: [Validators.required] }),
    endDate: new FormControl<Date | null>(null),
    currentPosition: new FormControl(false, { nonNullable: true }),
    confidential: new FormControl(false, { nonNullable: true }),
    organizationUrl: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(500)] }),
    displayOrder: new FormControl(10, { nonNullable: true, validators: [Validators.min(0)] }),
    skillIds: new FormControl<string[]>([], { nonNullable: true }),
    summaryFr: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(800)] }),
    missionsFr: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(5000)] }),
    achievementsFr: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(5000)] }),
    confidentialLabelFr: new FormControl('Client confidentiel', { nonNullable: true, validators: [Validators.maxLength(180)] }),
    summaryEn: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(800)] }),
    missionsEn: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(5000)] }),
    achievementsEn: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(5000)] }),
    confidentialLabelEn: new FormControl('Confidential client', { nonNullable: true, validators: [Validators.maxLength(180)] }),
  });

  readonly educationForm: CareerEducationForm = new FormGroup({
    id: new FormControl<string | null>(null),
    publicationStatus: new FormControl<PublicationStatus>('DRAFT', { nonNullable: true }),
    institution: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(180)] }),
    educationLevel: new FormControl<CareerEducation['educationLevel']>(null),
    location: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(180)] }),
    startDate: new FormControl<Date | null>(null, { validators: [Validators.required] }),
    endDate: new FormControl<Date | null>(null),
    currentEducation: new FormControl(false, { nonNullable: true }),
    url: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(500)] }),
    displayOrder: new FormControl(10, { nonNullable: true, validators: [Validators.min(0)] }),
    titleFr: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(220)] }),
    fieldFr: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(180)] }),
    descriptionFr: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(5000)] }),
    titleEn: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(220)] }),
    fieldEn: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(180)] }),
    descriptionEn: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(5000)] }),
  });

  readonly certificationForm: CareerCertificationForm = new FormGroup({
    id: new FormControl<string | null>(null),
    publicationStatus: new FormControl<PublicationStatus>('DRAFT', { nonNullable: true }),
    issuer: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(180)] }),
    issueDate: new FormControl<Date | null>(null, { validators: [Validators.required] }),
    expiryDate: new FormControl<Date | null>(null),
    noExpiry: new FormControl(true, { nonNullable: true }),
    credentialId: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(180)] }),
    verificationUrl: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(500)] }),
    displayOrder: new FormControl(10, { nonNullable: true, validators: [Validators.min(0)] }),
    nameFr: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(220)] }),
    descriptionFr: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(5000)] }),
    nameEn: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(220)] }),
    descriptionEn: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(5000)] }),
  });

  constructor() {
    this.loadAll();
  }

  dialogOpen(): boolean {
    return this.activeDialog() !== null;
  }

  dialogTitle(): string {
    const dialog = this.activeDialog();
    if (dialog === 'experience') {
      return this.experienceForm.controls.id.value ? "Modifier l'expérience" : 'Créer une expérience';
    }
    if (dialog === 'education') {
      return this.educationForm.controls.id.value ? 'Modifier la formation' : 'Créer une formation';
    }
    if (dialog === 'certification') {
      return this.certificationForm.controls.id.value ? 'Modifier la certification' : 'Créer une certification';
    }
    return 'Parcours';
  }

  loadAll(): void {
    this.loading.set(true);
    this.loadError.set(null);
    forkJoin({
      experiences: this.api.experiences(),
      education: this.api.education(),
      certifications: this.api.certifications(),
      metadata: this.api.metadata(),
      skills: this.skillsApi.getSkills(),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ experiences, education, certifications, metadata, skills }) => {
          this.experiences.set(experiences);
          this.education.set(education);
          this.certifications.set(certifications);
          this.metadata.set(metadata);
          this.skillOptions.set(
            skills.map((skill) => ({
              label: `${skill.translations.find((item) => item.languageCode === 'fr')?.name ?? 'Compétence'} · ${skill.categoryNameFr}`,
              value: skill.id,
              disabled: skill.publicationStatus === 'ARCHIVED',
            })),
          );
        },
        error: () => this.loadError.set("Impossible de charger le parcours professionnel."),
      });
  }

  loadExperiences(): void {
    this.api.experiences(this.experienceStatusFilter.value).subscribe({
      next: (experiences) => this.experiences.set(experiences),
      error: () => this.loadError.set("Impossible d'appliquer les filtres."),
    });
  }

  openExperienceDialog(experience: CareerExperience | null = null): void {
    this.formMessage.set(null);
    this.experienceForm.reset(experienceFormValue(experience, this.nextOrder(this.experiences())));
    this.syncExperienceDates();
    this.activeDialog.set('experience');
  }

  openEducationDialog(item: CareerEducation | null = null): void {
    this.formMessage.set(null);
    this.educationForm.reset(educationFormValue(item, this.nextOrder(this.education())));
    this.syncEducationDates();
    this.activeDialog.set('education');
  }

  openCertificationDialog(item: CareerCertification | null = null): void {
    this.formMessage.set(null);
    this.certificationForm.reset(certificationFormValue(item, this.nextOrder(this.certifications())));
    this.syncCertificationDates();
    this.activeDialog.set('certification');
  }

  saveExperience(): void {
    if (this.experienceForm.invalid || !this.validateDateRange(this.experienceForm.controls.startDate.value, this.experienceForm.controls.endDate.value, this.experienceForm.controls.currentPosition.value)) {
      this.experienceForm.markAllAsTouched();
      this.formMessage.set('Vérifiez les champs requis et la cohérence des dates.');
      return;
    }
    const id = this.experienceForm.controls.id.value;
    const request = id
      ? this.api.updateExperience(id, toExperiencePayload(this.experienceForm))
      : this.api.createExperience(toExperiencePayload(this.experienceForm));
    this.persist(request);
  }

  saveEducation(): void {
    if (this.educationForm.invalid || !this.validateDateRange(this.educationForm.controls.startDate.value, this.educationForm.controls.endDate.value, this.educationForm.controls.currentEducation.value)) {
      this.educationForm.markAllAsTouched();
      this.formMessage.set('Vérifiez les champs requis et la cohérence des dates.');
      return;
    }
    const id = this.educationForm.controls.id.value;
    const request = id
      ? this.api.updateEducation(id, toEducationPayload(this.educationForm))
      : this.api.createEducation(toEducationPayload(this.educationForm));
    this.persist(request);
  }

  saveCertification(): void {
    if (this.certificationForm.invalid || !this.validateCertificationDates()) {
      this.certificationForm.markAllAsTouched();
      this.formMessage.set('Vérifiez les champs requis et la cohérence des dates.');
      return;
    }
    const id = this.certificationForm.controls.id.value;
    const request = id
      ? this.api.updateCertification(id, toCertificationPayload(this.certificationForm))
      : this.api.createCertification(toCertificationPayload(this.certificationForm));
    this.persist(request);
  }

  deleteExperience(experience: CareerExperience): void {
    this.deleteTarget.set({ kind: 'experience', id: experience.id, label: experience.roleTitle });
  }

  deleteEducation(item: CareerEducation): void {
    this.deleteTarget.set({ kind: 'education', id: item.id, label: this.educationTitle(item.translations) });
  }

  deleteCertification(item: CareerCertification): void {
    this.deleteTarget.set({ kind: 'certification', id: item.id, label: this.certificationName(item.translations) });
  }

  confirmDelete(): void {
    const target = this.deleteTarget();
    if (!target) {
      return;
    }
    const request =
      target.kind === 'experience'
        ? this.api.deleteExperience(target.id)
        : target.kind === 'education'
          ? this.api.deleteEducation(target.id)
          : this.api.deleteCertification(target.id);
    this.persist(request);
  }

  onDialogVisibility(visible: boolean): void {
    if (!visible) {
      this.closeDialog();
    }
  }

  closeDialog(): void {
    if (!this.saving()) {
      this.activeDialog.set(null);
      this.formMessage.set(null);
    }
  }

  closeDeleteDialog(): void {
    if (!this.saving()) {
      this.deleteTarget.set(null);
      this.formMessage.set(null);
    }
  }

  syncExperienceDates(): void {
    if (this.experienceForm.controls.currentPosition.value) {
      this.experienceForm.controls.endDate.setValue(null);
      this.experienceForm.controls.endDate.disable();
    } else {
      this.experienceForm.controls.endDate.enable();
    }
  }

  syncEducationDates(): void {
    if (this.educationForm.controls.currentEducation.value) {
      this.educationForm.controls.endDate.setValue(null);
      this.educationForm.controls.endDate.disable();
    } else {
      this.educationForm.controls.endDate.enable();
    }
  }

  syncCertificationDates(): void {
    if (this.certificationForm.controls.noExpiry.value) {
      this.certificationForm.controls.expiryDate.setValue(null);
      this.certificationForm.controls.expiryDate.disable();
    } else {
      this.certificationForm.controls.expiryDate.enable();
    }
  }

  activeFormInvalid(): boolean {
    const dialog = this.activeDialog();
    return (
      (dialog === 'experience' && this.experienceForm.invalid) ||
      (dialog === 'education' && this.educationForm.invalid) ||
      (dialog === 'certification' && this.certificationForm.invalid)
    );
  }

  experienceSummary(translations: readonly CareerExperienceTranslation[]): string {
    return this.textFor(translations.find((translation) => translation.languageCode === 'fr')?.summary);
  }

  educationTitle(translations: readonly CareerEducationTranslation[]): string {
    return this.textFor(translations.find((translation) => translation.languageCode === 'fr')?.title);
  }

  educationField(translations: readonly CareerEducationTranslation[]): string {
    return this.textFor(translations.find((translation) => translation.languageCode === 'fr')?.field);
  }

  certificationName(translations: readonly CareerCertificationTranslation[]): string {
    return this.textFor(translations.find((translation) => translation.languageCode === 'fr')?.name);
  }

  period(startDate: string, endDate: string | null, current: boolean): string {
    return `${startDate} - ${current ? 'En cours' : endDate ?? 'Non renseigné'}`;
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

  private persist<T>(request: Observable<T>): void {
    this.saving.set(true);
    this.formMessage.set(null);
    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.activeDialog.set(null);
        this.deleteTarget.set(null);
        this.loadAll();
      },
      error: () => this.formMessage.set("L'opération n'a pas pu être enregistrée."),
    });
  }

  private validateDateRange(start: Date | null, end: Date | null, current: boolean): boolean {
    return !!start && (current || (!!end && end >= start));
  }

  private validateCertificationDates(): boolean {
    const issueDate = this.certificationForm.controls.issueDate.value;
    const expiryDate = this.certificationForm.controls.expiryDate.value;
    return !!issueDate && (this.certificationForm.controls.noExpiry.value || !expiryDate || expiryDate >= issueDate);
  }

  private nextOrder(items: readonly { displayOrder: number }[]): number {
    return Math.max(0, ...items.map((item) => item.displayOrder)) + 10;
  }

  private textFor(value: string | null | undefined): string {
    return value?.trim() || 'Non renseigné';
  }
}
