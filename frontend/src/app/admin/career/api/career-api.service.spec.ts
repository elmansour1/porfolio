import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AuthApiService } from '../../auth/api/auth-api.service';
import { CareerApiService } from './career-api.service';

describe('CareerApiService', () => {
  let service: CareerApiService;
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
    service = TestBed.inject(CareerApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads filtered admin experiences with credentials', () => {
    service.experiences('PUBLISHED').subscribe((experiences) => expect(experiences).toEqual([]));

    const request = http.expectOne('/api/v1/admin/experiences?status=PUBLISHED');
    expect(request.request.method).toBe('GET');
    expect(request.request.withCredentials).toBeTrue();
    request.flush([]);
  });

  it('uses csrf before writing an experience', () => {
    service
      .createExperience({
        publicationStatus: 'DRAFT',
        experienceType: 'EMPLOYMENT',
        contractType: null,
        organization: 'Example',
        roleTitle: 'Développeur',
        location: null,
        workMode: 'HYBRID',
        startDate: '2026-01-01',
        endDate: null,
        currentPosition: true,
        confidential: false,
        organizationUrl: null,
        logoMediaId: null,
        displayOrder: 10,
        translations: [
          {
            languageCode: 'fr',
            summary: 'Résumé',
            missions: null,
            achievements: null,
            confidentialLabel: null,
          },
          {
            languageCode: 'en',
            summary: 'Summary',
            missions: null,
            achievements: null,
            confidentialLabel: null,
          },
        ],
        skillIds: [],
      })
      .subscribe((experience) => expect(experience.id).toBe('experience-1'));

    const request = http.expectOne('/api/v1/admin/experiences');
    expect(request.request.method).toBe('POST');
    expect(request.request.withCredentials).toBeTrue();
    request.flush({
      id: 'experience-1',
      publicationStatus: 'DRAFT',
      experienceType: 'EMPLOYMENT',
      contractType: null,
      organization: 'Example',
      roleTitle: 'Développeur',
      location: null,
      workMode: 'HYBRID',
      startDate: '2026-01-01',
      endDate: null,
      currentPosition: true,
      confidential: false,
      organizationUrl: null,
      logoMediaId: null,
      displayOrder: 10,
      translations: [],
      skills: [],
    });
  });

  it('loads the public career timeline by language without admin credentials', () => {
    service.publicCareer('en').subscribe((career) => expect(career.language).toBe('en'));

    const request = http.expectOne('/api/v1/public/career?lang=en');
    expect(request.request.method).toBe('GET');
    expect(request.request.withCredentials).toBeFalsy();
    request.flush({ language: 'en', experiences: [], education: [], certifications: [] });
  });
});
