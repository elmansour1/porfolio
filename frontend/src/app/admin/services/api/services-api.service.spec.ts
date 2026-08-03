import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AuthApiService } from '../../auth/api/auth-api.service';
import { ServicesApiService } from './services-api.service';

describe('ServicesApiService', () => {
  let service: ServicesApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: AuthApiService,
          useValue: { csrf: () => of({ token: 'csrf-token', headerName: 'X-XSRF-TOKEN' }) },
        },
      ],
    });
    service = TestBed.inject(ServicesApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads admin services with filters and credentials', () => {
    service.list('PUBLISHED', true, 0, 12).subscribe((page) => expect(page.items).toEqual([]));

    const request = http.expectOne('/api/v1/admin/services?status=PUBLISHED&featured=true&page=0&size=12');
    expect(request.request.method).toBe('GET');
    expect(request.request.withCredentials).toBeTrue();
    request.flush({ items: [], page: 0, size: 12, totalItems: 0, totalPages: 0 });
  });

  it('uses csrf before publishing a service', () => {
    service.publish('service-1').subscribe((item) => expect(item.id).toBe('service-1'));

    const request = http.expectOne('/api/v1/admin/services/service-1/publish');
    expect(request.request.method).toBe('POST');
    expect(request.request.withCredentials).toBeTrue();
    request.flush({
      id: 'service-1',
      slug: 'service-1',
      title: 'Service',
      publicationStatus: 'PUBLISHED',
      featured: false,
      displayOrder: 0,
      icon: null,
      visualUrl: null,
      ctaType: null,
      ctaTarget: null,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      translations: [],
      benefits: [],
      deliverables: [],
      technologies: [],
      skills: [],
    });
  });

  it('loads public services and work process without admin credentials', () => {
    service.publicServices('en').subscribe((items) => expect(items).toEqual([]));
    service.publicWorkProcessSteps('en').subscribe((items) => expect(items).toEqual([]));

    const servicesRequest = http.expectOne('/api/v1/public/services?lang=en');
    expect(servicesRequest.request.method).toBe('GET');
    expect(servicesRequest.request.withCredentials).toBeFalsy();
    servicesRequest.flush([]);

    const processRequest = http.expectOne('/api/v1/public/services/work-process/steps?lang=en');
    expect(processRequest.request.method).toBe('GET');
    expect(processRequest.request.withCredentials).toBeFalsy();
    processRequest.flush([]);
  });
});
