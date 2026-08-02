import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { type FileUploadHandlerEvent } from 'primeng/types/fileupload';

import { SelectOption } from '../../../shared/models/select-option.model';
import { ProfileApiService } from '../api/profile-api.service';
import { AdminSiteSettings, SectionSetting } from '../models/dto/profile.dto';
import { SettingsForm } from '../models/forms/settings-form.model';
import { toAdminSettingsPayload } from '../mappers/settings-form.mapper';

@Component({
  selector: 'app-settings-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    FileUploadModule,
    InputTextModule,
    SelectModule,
    ToggleSwitchModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="admin-content-page settings-page">
      <section class="admin-dashboard-hero" aria-labelledby="settings-title">
        <div>
          <p class="admin-eyebrow">Configuration</p>
          <h1 id="settings-title">Paramètres généraux</h1>
          <p>
            Gérez les paramètres utiles au portfolio sans créer de configuration libre non typée.
          </p>
        </div>
        <span class="admin-status-badge admin-status-badge--secure">
          <span class="admin-status-badge__dot" aria-hidden="true"></span>
          Contrat typé
        </span>
      </section>

      @if (loading()) {
        <section class="admin-section">Chargement des paramètres...</section>
      } @else if (loadError()) {
        <section class="admin-section admin-form-message admin-form-message--error">
          {{ loadError() }}
        </section>
      } @else {
        <form class="admin-editor-grid" [formGroup]="form" (ngSubmit)="save()">
          <div class="admin-editor-main">
            <section class="admin-section" aria-labelledby="site-identity-title">
              <div class="admin-section__header">
                <div>
                  <p class="admin-eyebrow">Identité</p>
                  <h2 id="site-identity-title">Site public</h2>
                </div>
              </div>
              <div class="admin-form-grid">
                <label>
                  <span>Nom public du site</span>
                  <input pInputText formControlName="publicSiteName" />
                </label>
                <label>
                  <span>Monogramme</span>
                  <input pInputText formControlName="monogram" maxlength="12" />
                </label>
                <label for="settings-default-language">
                  <span>Langue par défaut</span>
                  <p-select
                    inputId="settings-default-language"
                    formControlName="defaultLanguage"
                    [options]="languageOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Sélectionner une langue"
                    appendTo="body"
                  />
                </label>
                <div class="admin-fieldset">
                  <span>Langues actives</span>
                  <div class="admin-toggle-grid">
                    <label class="admin-toggle-row" for="settings-active-fr">
                      <span>Français</span>
                      <p-toggleswitch inputId="settings-active-fr" formControlName="activeFr" />
                    </label>
                    <label class="admin-toggle-row" for="settings-active-en">
                      <span>Anglais</span>
                      <p-toggleswitch inputId="settings-active-en" formControlName="activeEn" />
                    </label>
                  </div>
                </div>
                <label>
                  <span>E-mail de réception interne</span>
                  <input pInputText formControlName="contactRecipientEmail" type="email" />
                </label>
                <label>
                  <span>Copyright</span>
                  <input pInputText formControlName="footerCopyright" />
                </label>
              </div>
            </section>

            <section class="admin-section" aria-labelledby="visibility-title">
              <div class="admin-section__header">
                <div>
                  <p class="admin-eyebrow">Visibilité</p>
                  <h2 id="visibility-title">Sections du portfolio</h2>
                </div>
              </div>
              <div class="admin-section-list">
                @for (section of sections(); track section.sectionKey; let index = $index) {
                  <div class="admin-section-row">
                    <div>
                      <strong>{{ section.label }}</strong>
                      <small>{{ section.sectionKey }}</small>
                    </div>
                    <label class="admin-toggle-row" [for]="'settings-section-' + section.sectionKey">
                      <span>Visible</span>
                      <p-toggleswitch
                        [inputId]="'settings-section-' + section.sectionKey"
                        [ngModel]="section.visible"
                        [ngModelOptions]="{ standalone: true }"
                        (ngModelChange)="updateSection(index, $event)"
                      />
                    </label>
                  </div>
                }
              </div>
            </section>
          </div>

          <aside class="admin-editor-aside">
            <section class="admin-panel">
              <div class="admin-panel__header">
                <div>
                  <p class="admin-eyebrow">Publication</p>
                  <h2>Affichage global</h2>
                </div>
              </div>
              <div class="admin-toggle-grid">
                <label class="admin-toggle-row" for="settings-show-cv-download">
                  <span>Bouton de téléchargement du CV</span>
                  <p-toggleswitch inputId="settings-show-cv-download" formControlName="showCvDownload" />
                </label>
                <label class="admin-toggle-row" for="settings-show-contact-details">
                  <span>Coordonnées publiques</span>
                  <p-toggleswitch inputId="settings-show-contact-details" formControlName="showContactDetails" />
                </label>
                <label class="admin-toggle-row" for="settings-show-social-links">
                  <span>Réseaux sociaux</span>
                  <p-toggleswitch inputId="settings-show-social-links" formControlName="showSocialLinks" />
                </label>
                <label class="admin-toggle-row" for="settings-maintenance-mode">
                  <span>Mode maintenance</span>
                  <p-toggleswitch inputId="settings-maintenance-mode" formControlName="maintenanceMode" />
                </label>
              </div>
            </section>

            <section class="admin-panel">
              <div class="admin-panel__header">
                <div>
                  <p class="admin-eyebrow">Logo</p>
                  <h2>Marque</h2>
                </div>
              </div>
              @if (settings()?.logo; as logo) {
                <img class="admin-media-preview admin-media-preview--logo" [src]="logo.url" [alt]="logo.altText || 'Logo du site'" />
                <p class="admin-muted">{{ logo.fileName }} · {{ mediaSize(logo.sizeBytes) }}</p>
                <p-button label="Supprimer le logo" icon="pi pi-trash" severity="danger" type="button" (onClick)="deleteLogo()" />
              } @else {
                <p class="admin-muted">Aucun logo téléversé. Le monogramme est utilisé.</p>
              }
              <label><span>Texte alternatif</span><input pInputText formControlName="logoAltText" /></label>
              <p-fileupload
                mode="basic"
                styleClass="admin-file-upload"
                chooseLabel="Téléverser le logo"
                chooseIcon="pi pi-upload"
                accept="image/png,image/jpeg,image/webp,image/avif"
                [auto]="true"
                [customUpload]="true"
                [maxFileSize]="5242880"
                (uploadHandler)="uploadLogo($event)"
              />
            </section>

            <section class="admin-panel">
              <div class="admin-panel__header">
                <div>
                  <p class="admin-eyebrow">Favicon</p>
                  <h2>Icône navigateur</h2>
                </div>
              </div>
              @if (settings()?.favicon; as favicon) {
                <p class="admin-muted">{{ favicon.fileName }} · {{ mediaSize(favicon.sizeBytes) }}</p>
                <p-button label="Supprimer le favicon" icon="pi pi-trash" severity="danger" type="button" (onClick)="deleteFavicon()" />
              } @else {
                <p class="admin-muted">Aucun favicon téléversé.</p>
              }
              <p-fileupload
                mode="basic"
                styleClass="admin-file-upload"
                chooseLabel="Téléverser le favicon"
                chooseIcon="pi pi-upload"
                accept="image/png,image/jpeg,image/webp,image/avif"
                [auto]="true"
                [customUpload]="true"
                [maxFileSize]="2097152"
                (uploadHandler)="uploadFavicon($event)"
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
              [label]="saving() ? 'Enregistrement...' : 'Enregistrer les paramètres'"
              [disabled]="saving() || form.invalid"
            />
          </div>
        </form>
      }
    </div>
  `,
})
export class SettingsPage {
  private readonly api = inject(ProfileApiService);

  readonly languageOptions: SelectOption<'fr' | 'en'>[] = [
    { label: 'Français', value: 'fr' },
    { label: 'Anglais', value: 'en' },
  ];

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly message = signal<string | null>(null);
  readonly messageType = signal<'success' | 'error'>('success');
  readonly settings = signal<AdminSiteSettings | null>(null);
  readonly sections = signal<SectionSetting[]>([]);

  readonly form: SettingsForm = new FormGroup({
    publicSiteName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    monogram: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    defaultLanguage: new FormControl<'fr' | 'en'>('fr', { nonNullable: true }),
    activeFr: new FormControl(true, { nonNullable: true }),
    activeEn: new FormControl(true, { nonNullable: true }),
    contactRecipientEmail: new FormControl('', { nonNullable: true, validators: [Validators.email] }),
    footerCopyright: new FormControl('', { nonNullable: true }),
    showCvDownload: new FormControl(false, { nonNullable: true }),
    showContactDetails: new FormControl(false, { nonNullable: true }),
    showSocialLinks: new FormControl(true, { nonNullable: true }),
    maintenanceMode: new FormControl(false, { nonNullable: true }),
    logoAltText: new FormControl('', { nonNullable: true }),
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
    const current = this.settings();
    if (!current || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.message.set(null);
    this.api
      .saveSettings(toAdminSettingsPayload(current, this.form, this.sections()))
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (settings) => {
          this.applySettings(settings);
          this.form.markAsPristine();
          this.messageType.set('success');
          this.message.set('Paramètres enregistrés.');
        },
        error: () => {
          this.messageType.set('error');
          this.message.set("Les paramètres n'ont pas pu être enregistrés.");
        },
      });
  }

  updateSection(index: number, visible: boolean): void {
    this.sections.update((sections) =>
      sections.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, visible } : section,
      ),
    );
    this.form.markAsDirty();
  }

  uploadLogo(event: FileUploadHandlerEvent): void {
    const file = this.firstFile(event);
    if (!file) {
      return;
    }
    this.api.uploadLogo(file, this.form.controls.logoAltText.value).subscribe({
      next: (settings) => this.applySettings(settings),
      error: () => this.setError("Le logo n'a pas pu être téléversé."),
    });
  }

  deleteLogo(): void {
    this.api.deleteLogo().subscribe({
      next: (settings) => this.applySettings(settings),
      error: () => this.setError("Le logo n'a pas pu être supprimé."),
    });
  }

  uploadFavicon(event: FileUploadHandlerEvent): void {
    const file = this.firstFile(event);
    if (!file) {
      return;
    }
    this.api.uploadFavicon(file).subscribe({
      next: (settings) => this.applySettings(settings),
      error: () => this.setError("Le favicon n'a pas pu être téléversé."),
    });
  }

  deleteFavicon(): void {
    this.api.deleteFavicon().subscribe({
      next: (settings) => this.applySettings(settings),
      error: () => this.setError("Le favicon n'a pas pu être supprimé."),
    });
  }

  mediaSize(size: number): string {
    return `${Math.max(1, Math.round(size / 1024))} Ko`;
  }

  private load(): void {
    this.api
      .getSettings()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (settings) => this.applySettings(settings),
        error: () => this.loadError.set('Impossible de charger les paramètres généraux.'),
      });
  }

  private applySettings(settings: AdminSiteSettings): void {
    this.settings.set(settings);
    this.sections.set([...settings.sections]);
    this.form.patchValue({
      publicSiteName: settings.publicSiteName,
      monogram: settings.monogram,
      defaultLanguage: settings.defaultLanguage,
      activeFr: settings.activeLanguages.includes('fr'),
      activeEn: settings.activeLanguages.includes('en'),
      contactRecipientEmail: settings.contactRecipientEmail ?? '',
      footerCopyright: settings.footerCopyright ?? '',
      showCvDownload: settings.showCvDownload,
      showContactDetails: settings.showContactDetails,
      showSocialLinks: settings.showSocialLinks,
      maintenanceMode: settings.maintenanceMode,
      logoAltText: settings.logo?.altText ?? '',
    });
  }

  private firstFile(event: FileUploadHandlerEvent): File | null {
    return event.files.length ? event.files[0] : null;
  }

  private setError(message: string): void {
    this.messageType.set('error');
    this.message.set(message);
  }
}
