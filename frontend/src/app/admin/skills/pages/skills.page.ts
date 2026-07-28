import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, finalize, forkJoin } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { PublicationStatus } from '../../profile/models/dto/profile.dto';
import { AdminEmptyStateComponent } from '../../shared/ui/admin-empty-state.component';
import { AdminStatusBadgeComponent } from '../../shared/ui/admin-status-badge.component';
import { SelectOption } from '../../../shared/models/select-option.model';
import { SkillsApiService } from '../api/skills-api.service';
import {
  Skill,
  SkillCategory,
  SkillLevel,
  SkillMetadata,
  SkillTranslation,
} from '../models/dto/skills.dto';
import { SkillCategoryForm, SkillForm } from '../models/forms/skills-form.model';
import {
  categoryFormValue,
  skillFormValue,
  toCategoryPayload,
  toSkillPayload,
} from '../mappers/skills-form.mapper';

type DeleteTarget =
  | { readonly kind: 'category'; readonly id: string; readonly label: string }
  | { readonly kind: 'skill'; readonly id: string; readonly label: string };

@Component({
  selector: 'app-skills-page',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    InputNumberModule,
    InputTextModule,
    SelectModule,
    TableModule,
    TagModule,
    TextareaModule,
    ToggleSwitchModule,
    AdminEmptyStateComponent,
    AdminStatusBadgeComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="admin-content-page skills-page">
      <section class="admin-dashboard-hero" aria-labelledby="skills-title">
        <div>
          <p class="admin-eyebrow">Expertises publiables</p>
          <h1 id="skills-title">Compétences et catégories</h1>
          <p>
            Structurez les expertises par domaine, traduisez les contenus et contrôlez leur
            visibilité publique sans afficher de brouillons.
          </p>
        </div>
        <app-admin-status-badge label="PrimeNG selects" tone="secure" />
      </section>

      @if (loading()) {
        <section class="admin-section" aria-live="polite">Chargement des compétences...</section>
      } @else if (loadError()) {
        <section class="admin-section admin-form-message admin-form-message--error">
          {{ loadError() }}
        </section>
      } @else {
        <section class="admin-section" aria-labelledby="skill-categories-title">
          <div class="admin-section__header">
            <div>
              <p class="admin-eyebrow">Domaines</p>
              <h2 id="skill-categories-title">Catégories</h2>
            </div>
            <p-button
              label="Ajouter une catégorie"
              icon="pi pi-plus"
              size="small"
              (onClick)="openCategoryDialog()"
            />
          </div>

          <p-table
            [value]="categories()"
            [paginator]="categories().length > 6"
            [rows]="6"
            styleClass="admin-prime-table"
            responsiveLayout="stack"
          >
            <ng-template pTemplate="header">
              <tr>
                <th>Nom</th>
                <th>Statut</th>
                <th>Ordre</th>
                <th>Compétences</th>
                <th>Actions</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-category>
              <tr>
                <td>{{ categoryName(category) }}</td>
                <td>
                  <p-tag
                    [value]="statusLabel(category.publicationStatus)"
                    [severity]="statusSeverity(category.publicationStatus)"
                  />
                </td>
                <td>{{ category.displayOrder }}</td>
                <td>{{ category.skillCount }}</td>
                <td class="admin-table-actions">
                  <p-button
                    icon="pi pi-pencil"
                    label="Modifier"
                    size="small"
                    severity="secondary"
                    (onClick)="openCategoryDialog(category)"
                  />
                  <p-button
                    icon="pi pi-trash"
                    label="Supprimer"
                    size="small"
                    severity="danger"
                    [disabled]="category.skillCount > 0"
                    (onClick)="deleteCategory(category)"
                  />
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="5">
                  <app-admin-empty-state
                    title="Aucune catégorie"
                    description="Créez une catégorie avant d'ajouter une compétence."
                    icon="pi pi-tags"
                    titleId="skills-category-empty"
                  />
                </td>
              </tr>
            </ng-template>
          </p-table>
        </section>

        <section class="admin-section" aria-labelledby="skills-list-title">
          <div class="admin-section__header">
            <div>
              <p class="admin-eyebrow">Technologies et savoir-faire</p>
              <h2 id="skills-list-title">Compétences</h2>
            </div>
            <p-button
              label="Ajouter une compétence"
              icon="pi pi-plus"
              size="small"
              [disabled]="categories().length === 0"
              (onClick)="openSkillDialog()"
            />
          </div>

          <div class="admin-filter-bar" aria-label="Filtres des compétences">
            <label for="skill-filter-category">
              <span>Catégorie</span>
              <p-select
                inputId="skill-filter-category"
                [options]="categoryOptions()"
                optionLabel="label"
                optionValue="value"
                [showClear]="true"
                placeholder="Toutes les catégories"
                [formControl]="categoryFilter"
              />
            </label>
            <label for="skill-filter-status">
              <span>Statut</span>
              <p-select
                inputId="skill-filter-status"
                [options]="statusOptions()"
                optionLabel="label"
                optionValue="value"
                [showClear]="true"
                placeholder="Tous les statuts"
                [formControl]="statusFilter"
              />
            </label>
            <label for="skill-filter-featured">
              <span>Mise en avant</span>
              <p-select
                inputId="skill-filter-featured"
                [options]="featuredOptions"
                optionLabel="label"
                optionValue="value"
                [showClear]="true"
                placeholder="Toutes"
                [formControl]="featuredFilter"
              />
            </label>
            <label for="skill-filter-query">
              <span>Recherche</span>
              <input
                pInputText
                id="skill-filter-query"
                type="search"
                [formControl]="queryFilter"
                placeholder="Nom, description, usage"
                aria-label="Rechercher une compétence"
              />
            </label>
            <p-button label="Appliquer" icon="pi pi-filter" size="small" (onClick)="loadSkills()" />
          </div>

          <p-table
            [value]="skills()"
            [paginator]="skills().length > 8"
            [rows]="8"
            styleClass="admin-prime-table"
            responsiveLayout="stack"
          >
            <ng-template pTemplate="header">
              <tr>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Niveau</th>
                <th>Statut</th>
                <th>Visible</th>
                <th>Ordre</th>
                <th>Actions</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-skill>
              <tr>
                <td>
                  <strong>{{ skillName(skill) }}</strong>
                  @if (skill.featured) {
                    <span class="admin-inline-flag">Mis en avant</span>
                  }
                </td>
                <td>{{ skill.categoryNameFr }}</td>
                <td>{{ levelLabel(skill.level) }}</td>
                <td>
                  <p-tag
                    [value]="statusLabel(skill.publicationStatus)"
                    [severity]="statusSeverity(skill.publicationStatus)"
                  />
                </td>
                <td>{{ skill.visible ? 'Oui' : 'Non' }}</td>
                <td>{{ skill.displayOrder }}</td>
                <td class="admin-table-actions">
                  <p-button
                    icon="pi pi-pencil"
                    label="Modifier"
                    size="small"
                    severity="secondary"
                    (onClick)="openSkillDialog(skill)"
                  />
                  <p-button
                    icon="pi pi-trash"
                    label="Supprimer"
                    size="small"
                    severity="danger"
                    (onClick)="deleteSkill(skill)"
                  />
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="7">
                  <app-admin-empty-state
                    title="Aucune compétence"
                    description="Aucune compétence ne correspond aux filtres actuels."
                    icon="pi pi-bolt"
                    titleId="skills-empty"
                  />
                </td>
              </tr>
            </ng-template>
          </p-table>
        </section>
      }
    </div>

    <p-dialog
      [header]="categoryForm.controls.id.value ? 'Modifier la catégorie' : 'Créer une catégorie'"
      [visible]="categoryDialogOpen()"
      (visibleChange)="categoryDialogOpen.set($event)"
      [modal]="true"
      [style]="{ width: 'min(44rem, calc(100vw - 2rem))' }"
    >
      <form class="admin-dialog-form" [formGroup]="categoryForm" (ngSubmit)="saveCategory()">
        <div class="admin-form-grid">
          <label for="category-status">
            <span>Statut</span>
            <p-select
              inputId="category-status"
              formControlName="publicationStatus"
              [options]="statusOptions()"
              optionLabel="label"
              optionValue="value"
              placeholder="Sélectionner un statut"
            />
          </label>
          <label for="category-order">
            <span>Ordre</span>
            <p-inputnumber inputId="category-order" formControlName="displayOrder" [min]="0" />
          </label>
          <label for="category-icon">
            <span>Icône</span>
            <input id="category-icon" pInputText formControlName="icon" placeholder="pi pi-server" />
          </label>
        </div>
        <div class="admin-language-grid">
          <fieldset>
            <legend>Français</legend>
            <label><span>Nom</span><input pInputText formControlName="nameFr" /></label>
            <label>
              <span>Description</span>
              <textarea pTextarea formControlName="descriptionFr" rows="3"></textarea>
            </label>
          </fieldset>
          <fieldset>
            <legend>English</legend>
            <label><span>Name</span><input pInputText formControlName="nameEn" /></label>
            <label>
              <span>Description</span>
              <textarea pTextarea formControlName="descriptionEn" rows="3"></textarea>
            </label>
          </fieldset>
        </div>
        @if (formMessage()) {
          <p class="admin-form-message admin-form-message--error">{{ formMessage() }}</p>
        }
        <div class="admin-dialog-actions">
          <p-button label="Annuler" severity="secondary" type="button" (onClick)="closeDialogs()" />
          <p-button
            label="Enregistrer"
            icon="pi pi-save"
            type="submit"
            [disabled]="categoryForm.invalid || saving()"
          />
        </div>
      </form>
    </p-dialog>

    <p-dialog
      [header]="skillForm.controls.id.value ? 'Modifier la compétence' : 'Créer une compétence'"
      [visible]="skillDialogOpen()"
      (visibleChange)="skillDialogOpen.set($event)"
      [modal]="true"
      [style]="{ width: 'min(58rem, calc(100vw - 2rem))' }"
    >
      <form class="admin-dialog-form" [formGroup]="skillForm" (ngSubmit)="saveSkill()">
        <div class="admin-form-grid">
          <label for="skill-category">
            <span>Catégorie</span>
            <p-select
              inputId="skill-category"
              formControlName="categoryId"
              [options]="categoryOptions()"
              optionLabel="label"
              optionValue="value"
              [filter]="categoryOptions().length > 8"
              placeholder="Sélectionner une catégorie"
              emptyMessage="Aucune catégorie disponible"
            />
          </label>
          <label for="skill-level">
            <span>Niveau qualitatif</span>
            <p-select
              inputId="skill-level"
              formControlName="level"
              [options]="levelOptions()"
              optionLabel="label"
              optionValue="value"
              [showClear]="true"
              placeholder="Niveau facultatif"
            />
          </label>
          <label for="skill-status">
            <span>Statut</span>
            <p-select
              inputId="skill-status"
              formControlName="publicationStatus"
              [options]="statusOptions()"
              optionLabel="label"
              optionValue="value"
              placeholder="Sélectionner un statut"
            />
          </label>
          <label for="skill-order">
            <span>Ordre</span>
            <p-inputnumber inputId="skill-order" formControlName="displayOrder" [min]="0" />
          </label>
          <label for="skill-icon">
            <span>Icône</span>
            <input id="skill-icon" pInputText formControlName="icon" placeholder="pi pi-code" />
          </label>
          <label class="admin-toggle-field" for="skill-featured">
            <span>Mise en avant</span>
            <p-toggleswitch formControlName="featured" inputId="skill-featured" />
          </label>
          <label class="admin-toggle-field" for="skill-visible">
            <span>Visible publiquement</span>
            <p-checkbox formControlName="visible" inputId="skill-visible" [binary]="true" />
          </label>
        </div>
        <div class="admin-language-grid">
          <fieldset>
            <legend>Français</legend>
            <label><span>Nom</span><input pInputText formControlName="nameFr" /></label>
            <label>
              <span>Description</span>
              <textarea pTextarea formControlName="descriptionFr" rows="3"></textarea>
            </label>
            <label>
              <span>Usage concret</span>
              <textarea pTextarea formControlName="usageSummaryFr" rows="3"></textarea>
            </label>
          </fieldset>
          <fieldset>
            <legend>English</legend>
            <label><span>Name</span><input pInputText formControlName="nameEn" /></label>
            <label>
              <span>Description</span>
              <textarea pTextarea formControlName="descriptionEn" rows="3"></textarea>
            </label>
            <label>
              <span>Practical usage</span>
              <textarea pTextarea formControlName="usageSummaryEn" rows="3"></textarea>
            </label>
          </fieldset>
        </div>
        @if (formMessage()) {
          <p class="admin-form-message admin-form-message--error">{{ formMessage() }}</p>
        }
        <div class="admin-dialog-actions">
          <p-button label="Annuler" severity="secondary" type="button" (onClick)="closeDialogs()" />
          <p-button
            label="Enregistrer"
            icon="pi pi-save"
            type="submit"
            [disabled]="skillForm.invalid || saving()"
          />
        </div>
      </form>
    </p-dialog>

    <p-dialog
      header="Confirmer la suppression"
      [visible]="deleteTarget() !== null"
      (visibleChange)="closeDeleteDialog()"
      [modal]="true"
      [style]="{ width: 'min(30rem, calc(100vw - 2rem))' }"
    >
      @if (deleteTarget(); as target) {
        <div class="admin-dialog-form">
          <p>
            Supprimer définitivement
            <strong>{{ target.label }}</strong>
            ? L'archivage reste préférable lorsqu'un contenu doit être conservé.
          </p>
          @if (formMessage()) {
            <p class="admin-form-message admin-form-message--error">{{ formMessage() }}</p>
          }
          <div class="admin-dialog-actions">
            <p-button label="Annuler" severity="secondary" type="button" (onClick)="closeDeleteDialog()" />
            <p-button
              label="Supprimer"
              icon="pi pi-trash"
              severity="danger"
              type="button"
              [disabled]="saving()"
              (onClick)="confirmDelete()"
            />
          </div>
        </div>
      }
    </p-dialog>
  `,
})
export class SkillsPage {
  private readonly api = inject(SkillsApiService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly formMessage = signal<string | null>(null);
  readonly categories = signal<SkillCategory[]>([]);
  readonly skills = signal<Skill[]>([]);
  readonly metadata = signal<SkillMetadata>({
    publicationStatuses: [
      { label: 'Brouillon', value: 'DRAFT' },
      { label: 'Publié', value: 'PUBLISHED' },
      { label: 'Archivé', value: 'ARCHIVED' },
    ],
    levels: [
      { label: 'Notions', value: 'NOTIONS' },
      { label: 'Opérationnel', value: 'OPERATIONAL' },
      { label: 'Avancé', value: 'ADVANCED' },
      { label: 'Expertise principale', value: 'CORE_EXPERTISE' },
    ],
  });
  readonly categoryDialogOpen = signal(false);
  readonly skillDialogOpen = signal(false);
  readonly deleteTarget = signal<DeleteTarget | null>(null);

  readonly categoryFilter = new FormControl<string | null>(null);
  readonly statusFilter = new FormControl<PublicationStatus | null>(null);
  readonly featuredFilter = new FormControl<boolean | null>(null);
  readonly queryFilter = new FormControl('', { nonNullable: true });

  readonly featuredOptions: SelectOption<boolean>[] = [
    { label: 'Mises en avant', value: true },
    { label: 'Non mises en avant', value: false },
  ];

  readonly statusOptions = computed<SelectOption<PublicationStatus>[]>(() => [
    ...this.metadata().publicationStatuses,
  ]);
  readonly levelOptions = computed<SelectOption<SkillLevel>[]>(() => [...this.metadata().levels]);
  readonly categoryOptions = computed<SelectOption<string>[]>(() =>
    this.categories().map((category) => ({
      label: this.categoryName(category),
      value: category.id,
      disabled: category.publicationStatus === 'ARCHIVED',
    })),
  );

  readonly categoryForm: SkillCategoryForm = new FormGroup({
    id: new FormControl<string | null>(null),
    publicationStatus: new FormControl<PublicationStatus>('DRAFT', { nonNullable: true }),
    icon: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(80)] }),
    displayOrder: new FormControl(10, { nonNullable: true, validators: [Validators.min(0)] }),
    nameFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(160)],
    }),
    descriptionFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(600)],
    }),
    nameEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(160)],
    }),
    descriptionEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(600)],
    }),
  });

  readonly skillForm: SkillForm = new FormGroup({
    id: new FormControl<string | null>(null),
    categoryId: new FormControl<string | null>(null, { validators: [Validators.required] }),
    publicationStatus: new FormControl<PublicationStatus>('DRAFT', { nonNullable: true }),
    level: new FormControl<SkillLevel | null>(null),
    icon: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(80)] }),
    featured: new FormControl(false, { nonNullable: true }),
    visible: new FormControl(true, { nonNullable: true }),
    displayOrder: new FormControl(10, { nonNullable: true, validators: [Validators.min(0)] }),
    nameFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(160)],
    }),
    descriptionFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(600)],
    }),
    usageSummaryFr: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(600)],
    }),
    nameEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(160)],
    }),
    descriptionEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(600)],
    }),
    usageSummaryEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(600)],
    }),
  });

  constructor() {
    this.loadAll();
  }

  loadAll(): void {
    this.loading.set(true);
    this.loadError.set(null);
    forkJoin({
      categories: this.api.getCategories(),
      skills: this.api.getSkills(),
      metadata: this.api.getMetadata(),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ categories, skills, metadata }) => {
          this.categories.set(categories);
          this.skills.set(skills);
          this.metadata.set(metadata);
        },
        error: () => this.loadError.set("Impossible de charger la gestion des compétences."),
      });
  }

  loadSkills(): void {
    this.api
      .getSkills({
        categoryId: this.categoryFilter.value,
        status: this.statusFilter.value,
        featured: this.featuredFilter.value,
        query: this.queryFilter.value,
      })
      .subscribe({
        next: (skills) => this.skills.set(skills),
        error: () => this.loadError.set("Impossible d'appliquer les filtres."),
      });
  }

  openCategoryDialog(category?: SkillCategory): void {
    this.formMessage.set(null);
    this.categoryForm.reset(categoryFormValue(category, this.nextOrder(this.categories())));
    this.categoryDialogOpen.set(true);
  }

  openSkillDialog(skill?: Skill): void {
    this.formMessage.set(null);
    this.skillForm.reset(skillFormValue(skill, this.categories()[0]?.id ?? null, this.nextOrder(this.skills())));
    this.skillDialogOpen.set(true);
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }
    const payload = toCategoryPayload(this.categoryForm);
    const id = this.categoryForm.controls.id.value;
    const request = id ? this.api.updateCategory(id, payload) : this.api.createCategory(payload);
    this.persist(request, () => {
      this.categoryDialogOpen.set(false);
      this.loadAll();
    });
  }

  saveSkill(): void {
    if (this.skillForm.invalid) {
      this.skillForm.markAllAsTouched();
      return;
    }
    const payload = toSkillPayload(this.skillForm);
    const id = this.skillForm.controls.id.value;
    const request = id ? this.api.updateSkill(id, payload) : this.api.createSkill(payload);
    this.persist(request, () => {
      this.skillDialogOpen.set(false);
      this.loadAll();
    });
  }

  deleteCategory(category: SkillCategory): void {
    if (category.skillCount > 0) {
      return;
    }
    this.formMessage.set(null);
    this.deleteTarget.set({ kind: 'category', id: category.id, label: this.categoryName(category) });
  }

  deleteSkill(skill: Skill): void {
    this.formMessage.set(null);
    this.deleteTarget.set({ kind: 'skill', id: skill.id, label: this.skillName(skill) });
  }

  confirmDelete(): void {
    const target = this.deleteTarget();
    if (!target) {
      return;
    }
    const request =
      target.kind === 'category' ? this.api.deleteCategory(target.id) : this.api.deleteSkill(target.id);
    this.persist(request, () => {
      this.deleteTarget.set(null);
      this.loadAll();
    });
  }

  closeDialogs(): void {
    this.categoryDialogOpen.set(false);
    this.skillDialogOpen.set(false);
    this.formMessage.set(null);
  }

  closeDeleteDialog(): void {
    if (!this.saving()) {
      this.deleteTarget.set(null);
      this.formMessage.set(null);
    }
  }

  categoryName(category: SkillCategory): string {
    return this.translation(category.translations, 'fr')?.name || 'Catégorie sans nom';
  }

  skillName(skill: Skill): string {
    return this.skillTranslation(skill.translations, 'fr')?.name || 'Compétence sans nom';
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

  levelLabel(level: SkillLevel | null): string {
    if (!level) {
      return 'Non renseigné';
    }
    return this.levelOptions().find((option) => option.value === level)?.label ?? level;
  }

  private persist<T>(request: Observable<T>, onSuccess: () => void): void {
    this.saving.set(true);
    this.formMessage.set(null);
    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => onSuccess(),
      error: () => this.formMessage.set("L'opération n'a pas pu être enregistrée."),
    });
  }

  private translation(
    translations: readonly { languageCode: string; name: string; description: string | null }[],
    language: 'fr' | 'en',
  ) {
    return translations.find((translation) => translation.languageCode === language);
  }

  private skillTranslation(translations: readonly SkillTranslation[], language: 'fr' | 'en') {
    return translations.find((translation) => translation.languageCode === language);
  }

  private nextOrder(items: readonly { displayOrder: number }[]): number {
    return Math.max(0, ...items.map((item) => item.displayOrder)) + 10;
  }

}
