import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AdminSiteSettings, SectionSetting } from './profile.models';
import { ProfileApiService } from './profile-api.service';

type SettingsForm = FormGroup<{
  publicSiteName: FormControl<string>;
  monogram: FormControl<string>;
  defaultLanguage: FormControl<'fr' | 'en'>;
  activeFr: FormControl<boolean>;
  activeEn: FormControl<boolean>;
  contactRecipientEmail: FormControl<string>;
  footerCopyright: FormControl<string>;
  showCvDownload: FormControl<boolean>;
  showContactDetails: FormControl<boolean>;
  showSocialLinks: FormControl<boolean>;
  maintenanceMode: FormControl<boolean>;
  logoAltText: FormControl<string>;
}>;

@Component({
  selector: 'app-settings-page',
  imports: [ReactiveFormsModule],
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
                  <input formControlName="publicSiteName" />
                </label>
                <label>
                  <span>Monogramme</span>
                  <input formControlName="monogram" maxlength="12" />
                </label>
                <label>
                  <span>Langue par défaut</span>
                  <select formControlName="defaultLanguage">
                    <option value="fr">Français</option>
                    <option value="en">Anglais</option>
                  </select>
                </label>
                <div class="admin-fieldset">
                  <span>Langues actives</span>
                  <label class="admin-checkbox"><input type="checkbox" formControlName="activeFr" />Français</label>
                  <label class="admin-checkbox"><input type="checkbox" formControlName="activeEn" />Anglais</label>
                </div>
                <label>
                  <span>E-mail de réception interne</span>
                  <input formControlName="contactRecipientEmail" type="email" />
                </label>
                <label>
                  <span>Copyright</span>
                  <input formControlName="footerCopyright" />
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
                    <label class="admin-checkbox">
                      <input
                        type="checkbox"
                        [checked]="section.visible"
                        (change)="updateSection(index, eventChecked($event))"
                      />
                      Visible
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
              <label class="admin-checkbox"><input type="checkbox" formControlName="showCvDownload" />Bouton de téléchargement du CV</label>
              <label class="admin-checkbox"><input type="checkbox" formControlName="showContactDetails" />Coordonnées publiques</label>
              <label class="admin-checkbox"><input type="checkbox" formControlName="showSocialLinks" />Réseaux sociaux</label>
              <label class="admin-checkbox"><input type="checkbox" formControlName="maintenanceMode" />Mode maintenance</label>
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
                <button class="admin-danger-link" type="button" (click)="deleteLogo()">Supprimer le logo</button>
              } @else {
                <p class="admin-muted">Aucun logo téléversé. Le monogramme est utilisé.</p>
              }
              <label><span>Texte alternatif</span><input formControlName="logoAltText" /></label>
              <input type="file" accept="image/png,image/jpeg,image/webp,image/avif" (change)="uploadLogo($event)" />
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
                <button class="admin-danger-link" type="button" (click)="deleteFavicon()">Supprimer le favicon</button>
              } @else {
                <p class="admin-muted">Aucun favicon téléversé.</p>
              }
              <input type="file" accept="image/png,image/jpeg,image/webp,image/avif" (change)="uploadFavicon($event)" />
            </section>
          </aside>

          <div class="admin-editor-actions">
            @if (message()) {
              <p class="admin-form-message" [class.admin-form-message--error]="messageType() === 'error'">
                {{ message() }}
              </p>
            }
            <button class="admin-primary-link" type="submit" [disabled]="saving() || form.invalid">
              <i class="pi pi-save" aria-hidden="true"></i>
              {{ saving() ? 'Enregistrement...' : 'Enregistrer les paramètres' }}
            </button>
          </div>
        </form>
      }
    </div>
  `,
})
export class SettingsPage {
  private readonly api = inject(ProfileApiService);

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
      .saveSettings(this.toPayload(current))
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

  uploadLogo(event: Event): void {
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

  uploadFavicon(event: Event): void {
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

  eventChecked(event: Event): boolean {
    return event.target instanceof HTMLInputElement ? event.target.checked : false;
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

  private toPayload(current: AdminSiteSettings): AdminSiteSettings {
    const value = this.form.getRawValue();
    const activeLanguages: ('fr' | 'en')[] = [
      ...(value.activeFr ? (['fr'] as const) : []),
      ...(value.activeEn ? (['en'] as const) : []),
    ];
    return {
      ...current,
      publicSiteName: value.publicSiteName,
      monogram: value.monogram,
      defaultLanguage: value.defaultLanguage,
      activeLanguages,
      contactRecipientEmail: value.contactRecipientEmail || null,
      footerCopyright: value.footerCopyright || null,
      showCvDownload: value.showCvDownload,
      showContactDetails: value.showContactDetails,
      showSocialLinks: value.showSocialLinks,
      maintenanceMode: value.maintenanceMode,
      sections: this.sections(),
    };
  }

  private firstFile(event: Event): File | null {
    return event.target instanceof HTMLInputElement && event.target.files?.length
      ? event.target.files.item(0)
      : null;
  }

  private setError(message: string): void {
    this.messageType.set('error');
    this.message.set(message);
  }
}
