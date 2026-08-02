import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { TabsModule } from 'primeng/tabs';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { type FileUploadHandlerEvent } from 'primeng/types/fileupload';

import { SelectOption } from '../../../shared/models/select-option.model';
import {
  AdminProfile,
  AvailabilityStatus,
  ProfessionalLink,
  ProfessionalLinkType,
  ProfessionalStatistic,
  PublicationStatus,
} from '../models/dto/profile.dto';
import { ProfileForm, ProfileTranslationForm } from '../models/forms/profile-form.model';
import {
  profileTranslation,
  profileTranslationFormValue,
  toAdminProfilePayload,
} from '../mappers/profile-form.mapper';
import { ProfileApiService } from '../api/profile-api.service';

@Component({
  selector: 'app-profile-translation-fields',
  imports: [ReactiveFormsModule, InputTextModule, TextareaModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="group()" class="admin-translation-fields">
      <label>
        <span>Titre professionnel</span>
        <input pInputText formControlName="professionalTitle" />
      </label>
      <label>
        <span>Accroche</span>
        <input pInputText formControlName="tagline" />
      </label>
      <label class="admin-field--full">
        <span>Résumé court</span>
        <textarea pTextarea formControlName="shortSummary" rows="3"></textarea>
      </label>
      <label class="admin-field--full">
        <span>Biographie</span>
        <textarea pTextarea formControlName="biography" rows="5"></textarea>
      </label>
      <label class="admin-field--full">
        <span>À propos</span>
        <textarea pTextarea formControlName="aboutText" rows="5"></textarea>
      </label>
      <label>
        <span>Libellé disponibilité</span>
        <input pInputText formControlName="availabilityLabel" />
      </label>
      <div class="admin-form-grid admin-form-grid--compact">
        <label><span>CTA principal</span><input pInputText formControlName="primaryCtaLabel" /></label>
        <label><span>URL principal</span><input pInputText formControlName="primaryCtaUrl" /></label>
        <label><span>CTA secondaire</span><input pInputText formControlName="secondaryCtaLabel" /></label>
        <label><span>URL secondaire</span><input pInputText formControlName="secondaryCtaUrl" /></label>
      </div>
      <label class="admin-field--full">
        <span>Texte pied de page</span>
        <input pInputText formControlName="footerText" />
      </label>
    </div>
  `,
})
export class ProfileTranslationFieldsComponent {
  readonly group = input.required<ProfileTranslationForm>();
}

@Component({
  selector: 'app-profile-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    FileUploadModule,
    InputTextModule,
    SelectModule,
    TabsModule,
    ToggleSwitchModule,
    ProfileTranslationFieldsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="admin-content-page profile-page">
      <section class="admin-dashboard-hero" aria-labelledby="profile-title">
        <div>
          <p class="admin-eyebrow">Identité publique</p>
          <h1 id="profile-title">Profil professionnel</h1>
          <p>
            Gérez les informations affichables sur le portfolio. Les contenus privés restent
            masqués tant que leur visibilité n'est pas activée.
          </p>
        </div>
        <span class="admin-status-badge admin-status-badge--ready">
          <span class="admin-status-badge__dot" aria-hidden="true"></span>
          Données administrables
        </span>
      </section>

      @if (loading()) {
        <section class="admin-section" aria-live="polite">Chargement du profil...</section>
      } @else if (loadError()) {
        <section class="admin-section admin-form-message admin-form-message--error">
          {{ loadError() }}
        </section>
      } @else {
        <form class="admin-editor-grid" [formGroup]="form" (ngSubmit)="save()">
          <div class="admin-editor-main">
            <section class="admin-section" aria-labelledby="identity-title">
              <div class="admin-section__header">
                <div>
                  <p class="admin-eyebrow">Informations principales</p>
                  <h2 id="identity-title">Identité</h2>
                </div>
              </div>

              <div class="admin-form-grid">
                <label for="profile-publication-status">
                  <span>Statut</span>
                  <p-select
                    inputId="profile-publication-status"
                    formControlName="publicationStatus"
                    [options]="publicationStatusOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Sélectionner un statut"
                    appendTo="body"
                  />
                </label>
                <label for="profile-availability-status">
                  <span>Statut de disponibilité</span>
                  <p-select
                    inputId="profile-availability-status"
                    formControlName="availabilityStatus"
                    [options]="availabilityStatusOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Sélectionner une disponibilité"
                    appendTo="body"
                  />
                </label>
                <label>
                  <span>Prénom</span>
                  <input pInputText formControlName="firstName" autocomplete="given-name" />
                </label>
                <label>
                  <span>Nom</span>
                  <input pInputText formControlName="lastName" autocomplete="family-name" />
                </label>
                <label>
                  <span>Nom d'affichage</span>
                  <input pInputText formControlName="displayName" />
                </label>
                <label>
                  <span>Ville</span>
                  <input pInputText formControlName="location" autocomplete="address-level2" />
                </label>
                <label>
                  <span>Pays</span>
                  <input pInputText formControlName="country" autocomplete="country-name" />
                </label>
                <label>
                  <span>E-mail professionnel</span>
                  <input pInputText formControlName="professionalEmail" type="email" autocomplete="email" />
                </label>
                <label>
                  <span>Téléphone facultatif</span>
                  <input pInputText formControlName="phone" type="tel" autocomplete="tel" />
                </label>
              </div>
            </section>

            <section class="admin-section" aria-labelledby="presentation-title">
              <div class="admin-section__header">
                <div>
                  <p class="admin-eyebrow">Français et anglais</p>
                  <h2 id="presentation-title">Présentation publique</h2>
                </div>
              </div>

              <p-tabs value="fr" class="admin-language-tabs">
                <p-tablist>
                  <p-tab value="fr">Français</p-tab>
                  <p-tab value="en">English</p-tab>
                </p-tablist>
                <p-tabpanels>
                  <p-tabpanel value="fr">
                    <app-profile-translation-fields [group]="form.controls.fr" />
                  </p-tabpanel>
                  <p-tabpanel value="en">
                    <app-profile-translation-fields [group]="form.controls.en" />
                  </p-tabpanel>
                </p-tabpanels>
              </p-tabs>
            </section>

            <section class="admin-section" aria-labelledby="links-title">
              <div class="admin-section__header">
                <div>
                  <p class="admin-eyebrow">Réseaux</p>
                  <h2 id="links-title">Liens professionnels</h2>
                </div>
                <p-button label="Ajouter" icon="pi pi-plus" severity="secondary" type="button" (onClick)="addLink()" />
              </div>

              <div class="admin-list-editor">
                @for (link of links(); track $index; let index = $index) {
                  <div class="admin-list-row">
                    <p-select
                      ariaLabel="Type du lien"
                      [options]="linkTypeOptions"
                      optionLabel="label"
                      optionValue="value"
                      [ngModel]="link.type"
                      [ngModelOptions]="{ standalone: true }"
                      appendTo="body"
                      (onChange)="updateLinkType(index, $event.value)"
                    />
                    <input
                      pInputText
                      aria-label="Libellé du lien"
                      [value]="link.label"
                      (input)="updateLink(index, 'label', eventValue($event))"
                      placeholder="Libellé"
                    />
                    <input
                      pInputText
                      aria-label="URL du lien"
                      [value]="link.url"
                      (input)="updateLink(index, 'url', eventValue($event))"
                      placeholder="https://..."
                    />
                    <div class="admin-toggle-row">
                      <span>Visible</span>
                      <p-toggleswitch
                        ariaLabel="Visibilité du lien"
                        [ngModel]="link.visible"
                        [ngModelOptions]="{ standalone: true }"
                        (ngModelChange)="updateLink(index, 'visible', $event)"
                      />
                    </div>
                    <p-button
                      label="Retirer"
                      icon="pi pi-trash"
                      severity="danger"
                      type="button"
                      (onClick)="removeLink(index)"
                    />
                  </div>
                } @empty {
                  <p class="admin-muted">Aucun lien professionnel renseigné.</p>
                }
              </div>
            </section>

            <section class="admin-section" aria-labelledby="stats-title">
              <div class="admin-section__header">
                <div>
                  <p class="admin-eyebrow">Indicateurs réels</p>
                  <h2 id="stats-title">Statistiques professionnelles</h2>
                </div>
                <p-button label="Ajouter" icon="pi pi-plus" severity="secondary" type="button" (onClick)="addStatistic()" />
              </div>

              <div class="admin-list-editor">
                @for (statistic of statistics(); track $index; let index = $index) {
                  <div class="admin-list-row admin-list-row--stats">
                    <input
                      pInputText
                      aria-label="Valeur de la statistique"
                      [value]="statistic.value"
                      (input)="updateStatistic(index, 'value', eventValue($event))"
                      placeholder="Ex. 5+"
                    />
                    <input
                      pInputText
                      aria-label="Libellé français"
                      [value]="statistic.labelFr"
                      (input)="updateStatistic(index, 'labelFr', eventValue($event))"
                      placeholder="Libellé FR"
                    />
                    <input
                      pInputText
                      aria-label="Libellé anglais"
                      [value]="statistic.labelEn"
                      (input)="updateStatistic(index, 'labelEn', eventValue($event))"
                      placeholder="Label EN"
                    />
                    <div class="admin-toggle-row">
                      <span>Visible</span>
                      <p-toggleswitch
                        ariaLabel="Visibilité de la statistique"
                        [ngModel]="statistic.visible"
                        [ngModelOptions]="{ standalone: true }"
                        (ngModelChange)="updateStatistic(index, 'visible', $event)"
                      />
                    </div>
                    <p-button
                      label="Retirer"
                      icon="pi pi-trash"
                      severity="danger"
                      type="button"
                      (onClick)="removeStatistic(index)"
                    />
                  </div>
                } @empty {
                  <p class="admin-muted">Aucune statistique réelle renseignée.</p>
                }
              </div>
            </section>
          </div>

          <aside class="admin-editor-aside" aria-label="Visibilité et médias">
            <section class="admin-panel">
              <div class="admin-panel__header">
                <div>
                  <p class="admin-eyebrow">Publication</p>
                  <h2>Visibilité</h2>
                </div>
              </div>
              <div class="admin-toggle-grid">
                <label class="admin-toggle-row" for="profile-show-email">
                  <span>Afficher l'e-mail</span>
                  <p-toggleswitch inputId="profile-show-email" formControlName="showEmail" />
                </label>
                <label class="admin-toggle-row" for="profile-show-phone">
                  <span>Afficher le téléphone</span>
                  <p-toggleswitch inputId="profile-show-phone" formControlName="showPhone" />
                </label>
                <label class="admin-toggle-row" for="profile-show-photo">
                  <span>Afficher la photo</span>
                  <p-toggleswitch inputId="profile-show-photo" formControlName="showPhoto" />
                </label>
                <label class="admin-toggle-row" for="profile-show-cv">
                  <span>Autoriser le CV</span>
                  <p-toggleswitch inputId="profile-show-cv" formControlName="showCv" />
                </label>
                <label class="admin-toggle-row" for="profile-show-links">
                  <span>Afficher les liens</span>
                  <p-toggleswitch inputId="profile-show-links" formControlName="showLinks" />
                </label>
                <label class="admin-toggle-row" for="profile-show-statistics">
                  <span>Afficher les statistiques</span>
                  <p-toggleswitch inputId="profile-show-statistics" formControlName="showStatistics" />
                </label>
              </div>
            </section>

            <section class="admin-panel">
              <div class="admin-panel__header">
                <div>
                  <p class="admin-eyebrow">Photo</p>
                  <h2>Photo professionnelle</h2>
                </div>
              </div>
              @if (profile()?.photo; as photo) {
                <img class="admin-media-preview" [src]="photo.url" [alt]="photo.altText || 'Photo professionnelle'" />
                <p class="admin-muted">{{ photo.fileName }} · {{ mediaSize(photo.sizeBytes) }}</p>
                <p-button label="Supprimer" icon="pi pi-trash" severity="danger" type="button" (onClick)="deletePhoto()" />
              } @else {
                <p class="admin-muted">Aucune photo téléversée.</p>
              }
              <label>
                <span>Texte alternatif</span>
                <input pInputText formControlName="photoAltText" />
              </label>
              <p-fileupload
                mode="basic"
                styleClass="admin-file-upload"
                chooseLabel="Téléverser une photo"
                chooseIcon="pi pi-upload"
                accept="image/png,image/jpeg,image/webp,image/avif"
                [auto]="true"
                [customUpload]="true"
                [maxFileSize]="5242880"
                (uploadHandler)="uploadPhoto($event)"
              />
            </section>

            <section class="admin-panel">
              <div class="admin-panel__header">
                <div>
                  <p class="admin-eyebrow">CV</p>
                  <h2>Document PDF</h2>
                </div>
              </div>
              @if (profile()?.cv; as cv) {
                <p class="admin-muted">{{ cv.fileName }} · {{ mediaSize(cv.sizeBytes) }}</p>
                <a class="admin-secondary-link" [href]="cv.url" target="_blank" rel="noreferrer">Ouvrir</a>
                <p-button label="Supprimer" icon="pi pi-trash" severity="danger" type="button" (onClick)="deleteCv()" />
              } @else {
                <p class="admin-muted">Aucun CV téléversé.</p>
              }
              <p-fileupload
                mode="basic"
                styleClass="admin-file-upload"
                chooseLabel="Téléverser le CV"
                chooseIcon="pi pi-upload"
                accept="application/pdf"
                [auto]="true"
                [customUpload]="true"
                [maxFileSize]="10485760"
                (uploadHandler)="uploadCv($event)"
              />
            </section>
          </aside>

          <div class="admin-editor-actions">
            @if (message()) {
              <p class="admin-form-message" [class.admin-form-message--error]="messageType() === 'error'">
                {{ message() }}
              </p>
            }
            <p-button
              type="submit"
              icon="pi pi-save"
              [label]="saving() ? 'Enregistrement...' : 'Enregistrer le profil'"
              [disabled]="saving() || form.invalid"
            />
          </div>
        </form>
      }
    </div>

  `,
})
export class ProfilePage {
  private readonly api = inject(ProfileApiService);

  readonly publicationStatusOptions: SelectOption<PublicationStatus>[] = [
    { label: 'Brouillon', value: 'DRAFT' },
    { label: 'Publié', value: 'PUBLISHED' },
    { label: 'Archivé', value: 'ARCHIVED' },
  ];
  readonly availabilityStatusOptions: SelectOption<AvailabilityStatus>[] = [
    { label: 'Disponible', value: 'AVAILABLE' },
    { label: 'Ouvert aux opportunités', value: 'OPEN_TO_OPPORTUNITIES' },
    { label: 'Indisponible', value: 'UNAVAILABLE' },
    { label: 'Masqué', value: 'HIDDEN' },
  ];
  readonly linkTypeOptions: SelectOption<ProfessionalLinkType>[] = [
    { label: 'GitHub', value: 'GITHUB' },
    { label: 'LinkedIn', value: 'LINKEDIN' },
    { label: 'Site', value: 'PERSONAL_SITE' },
    { label: 'E-mail', value: 'EMAIL' },
    { label: 'Autre', value: 'OTHER' },
  ];

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly message = signal<string | null>(null);
  readonly messageType = signal<'success' | 'error'>('success');
  readonly profile = signal<AdminProfile | null>(null);
  readonly links = signal<ProfessionalLink[]>([]);
  readonly statistics = signal<ProfessionalStatistic[]>([]);

  readonly form: ProfileForm = new FormGroup({
    publicationStatus: new FormControl<AdminProfile['publicationStatus']>('DRAFT', {
      nonNullable: true,
    }),
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    displayName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    location: new FormControl('', { nonNullable: true }),
    country: new FormControl('', { nonNullable: true }),
    availabilityStatus: new FormControl<AdminProfile['availabilityStatus']>('HIDDEN', {
      nonNullable: true,
    }),
    professionalEmail: new FormControl('', { nonNullable: true, validators: [Validators.email] }),
    phone: new FormControl('', { nonNullable: true }),
    showEmail: new FormControl(false, { nonNullable: true }),
    showPhone: new FormControl(false, { nonNullable: true }),
    showPhoto: new FormControl(true, { nonNullable: true }),
    showCv: new FormControl(false, { nonNullable: true }),
    showLinks: new FormControl(true, { nonNullable: true }),
    showStatistics: new FormControl(true, { nonNullable: true }),
    photoAltText: new FormControl('', { nonNullable: true }),
    fr: this.translationGroup(),
    en: this.translationGroup(),
  });

  constructor() {
    this.load();
  }

  @HostListener('window:beforeunload', ['$event'])
  warnBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.form.dirty) {
      event.preventDefault();
    }
  }

  save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    const current = this.profile();
    if (!current) {
      return;
    }
    this.saving.set(true);
    this.message.set(null);
    this.api
      .saveProfile(toAdminProfilePayload(current, this.form, this.links(), this.statistics()))
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (profile) => {
          this.applyProfile(profile);
          this.form.markAsPristine();
          this.messageType.set('success');
          this.message.set('Profil enregistré.');
        },
        error: () => {
          this.messageType.set('error');
          this.message.set("Le profil n'a pas pu être enregistré. Vérifiez les champs et réessayez.");
        },
      });
  }

  addLink(): void {
    this.links.update((links) => [
      ...links,
      {
        type: 'GITHUB',
        label: '',
        url: '',
        icon: null,
        displayOrder: links.length * 10,
        visible: true,
        openInNewTab: true,
      },
    ]);
    this.form.markAsDirty();
  }

  removeLink(index: number): void {
    this.links.update((links) => links.filter((_, linkIndex) => linkIndex !== index));
    this.form.markAsDirty();
  }

  updateLink<K extends keyof ProfessionalLink>(index: number, key: K, value: ProfessionalLink[K]): void {
    this.links.update((links) =>
      links.map((link, linkIndex) => (linkIndex === index ? { ...link, [key]: value } : link)),
    );
    this.form.markAsDirty();
  }

  updateLinkType(index: number, value: string): void {
    if (this.isProfessionalLinkType(value)) {
      this.updateLink(index, 'type', value);
    }
  }

  addStatistic(): void {
    this.statistics.update((statistics) => [
      ...statistics,
      {
        value: '',
        labelFr: '',
        labelEn: '',
        displayOrder: statistics.length * 10,
        visible: true,
      },
    ]);
    this.form.markAsDirty();
  }

  removeStatistic(index: number): void {
    this.statistics.update((statistics) => statistics.filter((_, statIndex) => statIndex !== index));
    this.form.markAsDirty();
  }

  updateStatistic<K extends keyof ProfessionalStatistic>(
    index: number,
    key: K,
    value: ProfessionalStatistic[K],
  ): void {
    this.statistics.update((statistics) =>
      statistics.map((statistic, statIndex) =>
        statIndex === index ? { ...statistic, [key]: value } : statistic,
      ),
    );
    this.form.markAsDirty();
  }

  uploadPhoto(event: FileUploadHandlerEvent): void {
    const file = this.firstFile(event);
    if (!file) {
      return;
    }
    this.api.uploadProfilePhoto(file, this.form.controls.photoAltText.value).subscribe({
      next: (profile) => this.applyProfile(profile),
      error: () => this.setError("La photo n'a pas pu être téléversée."),
    });
  }

  deletePhoto(): void {
    this.api.deleteProfilePhoto().subscribe({
      next: (profile) => this.applyProfile(profile),
      error: () => this.setError("La photo n'a pas pu être supprimée."),
    });
  }

  uploadCv(event: FileUploadHandlerEvent): void {
    const file = this.firstFile(event);
    if (!file) {
      return;
    }
    this.api.uploadCv(file).subscribe({
      next: (profile) => this.applyProfile(profile),
      error: () => this.setError("Le CV n'a pas pu être téléversé."),
    });
  }

  deleteCv(): void {
    this.api.deleteCv().subscribe({
      next: (profile) => this.applyProfile(profile),
      error: () => this.setError("Le CV n'a pas pu être supprimé."),
    });
  }

  eventValue(event: Event): string {
    return event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement
      ? event.target.value
      : '';
  }

  mediaSize(size: number): string {
    return `${Math.max(1, Math.round(size / 1024))} Ko`;
  }

  private load(): void {
    this.api
      .getProfile()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (profile) => this.applyProfile(profile),
        error: () => this.loadError.set("Impossible de charger le profil professionnel."),
      });
  }

  private applyProfile(profile: AdminProfile): void {
    this.profile.set(profile);
    this.links.set([...profile.links]);
    this.statistics.set([...profile.statistics]);
    const fr = profileTranslationFormValue(profileTranslation(profile, 'fr'));
    const en = profileTranslationFormValue(profileTranslation(profile, 'en'));
    this.form.patchValue({
      publicationStatus: profile.publicationStatus,
      firstName: profile.firstName,
      lastName: profile.lastName,
      displayName: profile.displayName,
      location: profile.location ?? '',
      country: profile.country ?? '',
      availabilityStatus: profile.availabilityStatus,
      professionalEmail: profile.professionalEmail ?? '',
      phone: profile.phone ?? '',
      showEmail: profile.showEmail,
      showPhone: profile.showPhone,
      showPhoto: profile.showPhoto,
      showCv: profile.showCv,
      showLinks: profile.showLinks,
      showStatistics: profile.showStatistics,
      photoAltText: profile.photo?.altText ?? '',
      fr,
      en,
    });
  }

  private translationGroup(): ProfileTranslationForm {
    return new FormGroup({
      professionalTitle: new FormControl('', { nonNullable: true }),
      tagline: new FormControl('', { nonNullable: true }),
      shortSummary: new FormControl('', { nonNullable: true }),
      biography: new FormControl('', { nonNullable: true }),
      aboutText: new FormControl('', { nonNullable: true }),
      availabilityLabel: new FormControl('', { nonNullable: true }),
      primaryCtaLabel: new FormControl('', { nonNullable: true }),
      primaryCtaUrl: new FormControl('', { nonNullable: true }),
      secondaryCtaLabel: new FormControl('', { nonNullable: true }),
      secondaryCtaUrl: new FormControl('', { nonNullable: true }),
      footerText: new FormControl('', { nonNullable: true }),
    });
  }

  private isProfessionalLinkType(value: string): value is ProfessionalLinkType {
    return ['GITHUB', 'LINKEDIN', 'PERSONAL_SITE', 'EMAIL', 'OTHER'].includes(value);
  }

  private firstFile(event: FileUploadHandlerEvent): File | null {
    return event.files.length ? event.files[0] : null;
  }

  private setError(message: string): void {
    this.messageType.set('error');
    this.message.set(message);
  }
}
