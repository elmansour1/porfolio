import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HOME_COPY } from '../../models/home-page.model';
import { ContactFormComponent } from './contact-form.component';

describe('ContactFormComponent', () => {
  let fixture: ComponentFixture<ContactFormComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactFormComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ContactFormComponent);
    fixture.componentRef.setInput('copy', HOME_COPY['fr']);
    fixture.componentRef.setInput('language', 'fr');
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  function fillValidForm(): void {
    fixture.componentInstance.form.setValue({
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      company: '',
      requestType: 'GENERAL',
      subject: 'Sujet de test',
      message: 'Un message de contact suffisamment long pour passer la validation.',
      consent: true,
      website: '',
    });
  }

  it('blocks submission and shows required-field errors when the form is invalid', () => {
    fixture.componentInstance.submit();
    fixture.detectChanges();

    expect(fixture.componentInstance.form.invalid).toBeTrue();
    httpMock.expectNone(() => true);

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('.home-contact-form__field-error').length).toBeGreaterThan(0);
  });

  it('fetches a CSRF token then submits the payload on valid form submission', () => {
    fillValidForm();
    fixture.componentInstance.submit();

    const csrfRequest = httpMock.expectOne('/api/v1/public/contact/csrf');
    expect(csrfRequest.request.method).toBe('GET');
    csrfRequest.flush({ headerName: 'X-XSRF-TOKEN', parameterName: '_csrf', token: 'token-value' });

    const submitRequest = httpMock.expectOne('/api/v1/public/contact');
    expect(submitRequest.request.method).toBe('POST');
    expect(submitRequest.request.body.name).toBe('Jean Dupont');
    expect(submitRequest.request.body.consent).toBeTrue();
    submitRequest.flush(null);

    fixture.detectChanges();
    expect(fixture.componentInstance.state()).toBe('success');
  });

  it('never sends the honeypot value as filled by a human and keeps it empty on submit', () => {
    fillValidForm();
    fixture.componentInstance.submit();

    const csrfRequest = httpMock.expectOne('/api/v1/public/contact/csrf');
    csrfRequest.flush({ headerName: 'X-XSRF-TOKEN', parameterName: '_csrf', token: 'token-value' });

    const submitRequest = httpMock.expectOne('/api/v1/public/contact');
    expect(submitRequest.request.body.website).toBe('');
    submitRequest.flush(null);
  });

  it('shows the rate-limited message on a 429 response', () => {
    fillValidForm();
    fixture.componentInstance.submit();

    const csrfRequest = httpMock.expectOne('/api/v1/public/contact/csrf');
    csrfRequest.flush({ headerName: 'X-XSRF-TOKEN', parameterName: '_csrf', token: 'token-value' });

    const submitRequest = httpMock.expectOne('/api/v1/public/contact');
    submitRequest.flush('Too many requests', { status: 429, statusText: 'Too Many Requests' });

    fixture.detectChanges();
    expect(fixture.componentInstance.state()).toBe('error-rate-limited');
  });

  it('resets the form and returns to idle state after clicking "send another message"', () => {
    fillValidForm();
    fixture.componentInstance.submit();

    const csrfRequest = httpMock.expectOne('/api/v1/public/contact/csrf');
    csrfRequest.flush({ headerName: 'X-XSRF-TOKEN', parameterName: '_csrf', token: 'token-value' });
    httpMock.expectOne('/api/v1/public/contact').flush(null);
    fixture.detectChanges();

    fixture.componentInstance.reset();
    fixture.detectChanges();

    expect(fixture.componentInstance.state()).toBe('idle');
    expect(fixture.componentInstance.form.value.name).toBe('');
  });
});
