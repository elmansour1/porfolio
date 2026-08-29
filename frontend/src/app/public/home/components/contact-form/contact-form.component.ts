import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ContactApiService } from '../../../contact/api/contact-api.service';
import { CONTACT_REQUEST_TYPES, ContactRequestType, CONTACT_REQUEST_TYPE_LABELS } from '../../../contact/models/contact.model';
import { HomeCopy, PublicLanguage } from '../../models/home-page.model';

interface ContactFormGroup {
  name: FormControl<string>;
  email: FormControl<string>;
  company: FormControl<string>;
  requestType: FormControl<ContactRequestType>;
  subject: FormControl<string>;
  message: FormControl<string>;
  consent: FormControl<boolean>;
  website: FormControl<string>;
}

type ContactFormState = 'idle' | 'submitting' | 'success' | 'error-validation' | 'error-network' | 'error-rate-limited';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'home-contact-form-host' },
  template: `
    <div class="home-contact-form">
      <h3>{{ copy().contactFormTitle }}</h3>
      <p>{{ copy().contactFormIntro }}</p>

      @if (state() === 'success') {
        <div class="home-contact-form__success" role="status">
          <p class="home-contact-form__success-title">{{ copy().contactSuccessTitle }}</p>
          <p>{{ copy().contactSuccessMessage }}</p>
          <button type="button" class="home-button" (click)="reset()">
            {{ copy().contactSendAnother }}
          </button>
        </div>
      } @else {
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="home-contact-form__grid">
            <label for="contact-name">
              <span>{{ copy().contactNameLabel }}</span>
              <input id="contact-name" type="text" formControlName="name" autocomplete="name" />
              @if (showError('name')) {
                <small class="home-contact-form__field-error">{{ copy().contactRequiredField }}</small>
              }
            </label>

            <label for="contact-email">
              <span>{{ copy().contactEmailLabel }}</span>
              <input id="contact-email" type="email" formControlName="email" autocomplete="email" />
              @if (form.controls.email.touched && form.controls.email.hasError('required')) {
                <small class="home-contact-form__field-error">{{ copy().contactRequiredField }}</small>
              }
              @if (form.controls.email.touched && form.controls.email.hasError('email')) {
                <small class="home-contact-form__field-error">{{ copy().contactInvalidEmail }}</small>
              }
            </label>

            <label for="contact-company">
              <span>{{ copy().contactCompanyLabel }} <em>({{ copy().contactCompanyOptional }})</em></span>
              <input id="contact-company" type="text" formControlName="company" autocomplete="organization" />
            </label>

            <label for="contact-request-type">
              <span>{{ copy().contactRequestTypeLabel }}</span>
              <select id="contact-request-type" formControlName="requestType">
                @for (type of requestTypes; track type) {
                  <option [value]="type">{{ requestTypeLabel(type) }}</option>
                }
              </select>
            </label>

            <label for="contact-subject" class="home-contact-form__field--wide">
              <span>{{ copy().contactSubjectLabel }}</span>
              <input id="contact-subject" type="text" formControlName="subject" />
              @if (showError('subject')) {
                <small class="home-contact-form__field-error">{{ copy().contactRequiredField }}</small>
              }
            </label>

            <label for="contact-message" class="home-contact-form__field--wide">
              <span>{{ copy().contactMessageLabel }}</span>
              <textarea id="contact-message" rows="5" formControlName="message"></textarea>
              @if (form.controls.message.touched && form.controls.message.hasError('required')) {
                <small class="home-contact-form__field-error">{{ copy().contactRequiredField }}</small>
              }
              @if (form.controls.message.touched && form.controls.message.hasError('minlength')) {
                <small class="home-contact-form__field-error">{{ copy().contactMessageTooShort }}</small>
              }
            </label>
          </div>

          <div class="home-contact-form__honeypot" aria-hidden="true">
            <label for="contact-website">Website</label>
            <input id="contact-website" type="text" tabindex="-1" autocomplete="off" formControlName="website" />
          </div>

          <label class="home-contact-form__consent" for="contact-consent">
            <input id="contact-consent" type="checkbox" formControlName="consent" />
            <span>{{ copy().contactConsentLabel }}</span>
          </label>
          @if (showError('consent')) {
            <small class="home-contact-form__field-error">{{ copy().contactRequiredField }}</small>
          }

          @if (state() === 'error-validation') {
            <p class="home-contact-form__message home-contact-form__message--error" role="alert">
              {{ copy().contactErrorValidation }}
            </p>
          }
          @if (state() === 'error-network') {
            <p class="home-contact-form__message home-contact-form__message--error" role="alert">
              {{ copy().contactErrorNetwork }}
            </p>
          }
          @if (state() === 'error-rate-limited') {
            <p class="home-contact-form__message home-contact-form__message--error" role="alert">
              {{ copy().contactErrorRateLimited }}
            </p>
          }

          <button
            type="submit"
            class="home-button home-button--primary"
            [disabled]="state() === 'submitting'"
          >
            {{ state() === 'submitting' ? copy().contactSubmittingLabel : copy().contactSubmitLabel }}
          </button>
        </form>
      }
    </div>
  `,
})
export class ContactFormComponent {
  private readonly api = inject(ContactApiService);

  readonly copy = input.required<HomeCopy>();
  readonly language = input<PublicLanguage>('fr');

  readonly requestTypes = CONTACT_REQUEST_TYPES;
  readonly state = signal<ContactFormState>('idle');

  readonly form = new FormGroup<ContactFormGroup>({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    company: new FormControl('', { nonNullable: true }),
    requestType: new FormControl<ContactRequestType>('GENERAL', { nonNullable: true }),
    subject: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    message: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20)],
    }),
    consent: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
    website: new FormControl('', { nonNullable: true }),
  });

  requestTypeLabel(type: ContactRequestType): string {
    return CONTACT_REQUEST_TYPE_LABELS[type][this.language()];
  }

  showError(controlName: keyof ContactFormGroup): boolean {
    const control = this.form.controls[controlName];
    return control.touched && control.hasError('required');
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.state.set('submitting');
    const value = this.form.getRawValue();
    this.api
      .submit({
        name: value.name.trim(),
        email: value.email.trim(),
        company: value.company.trim() || null,
        requestType: value.requestType,
        subject: value.subject.trim(),
        message: value.message.trim(),
        consent: value.consent,
        website: value.website,
      })
      .subscribe({
        next: () => this.state.set('success'),
        error: (error: unknown) => this.state.set(this.classifyError(error)),
      });
  }

  reset(): void {
    this.form.reset({
      name: '',
      email: '',
      company: '',
      requestType: 'GENERAL',
      subject: '',
      message: '',
      consent: false,
      website: '',
    });
    this.state.set('idle');
  }

  private classifyError(error: unknown): ContactFormState {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 429) {
        return 'error-rate-limited';
      }
      if (error.status === 400) {
        return 'error-validation';
      }
    }
    return 'error-network';
  }
}
