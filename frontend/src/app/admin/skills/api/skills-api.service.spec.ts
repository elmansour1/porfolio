import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AuthApiService } from '../../auth/api/auth-api.service';
import { SkillsApiService } from './skills-api.service';

describe('SkillsApiService', () => {
  let service: SkillsApiService;
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
    service = TestBed.inject(SkillsApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads admin skills with typed filters', () => {
    service
      .getSkills({
        categoryId: 'category-1',
        status: 'PUBLISHED',
        featured: true,
        query: 'java',
      })
      .subscribe((skills) => expect(skills).toEqual([]));

    const request = http.expectOne(
      '/api/v1/admin/skills?categoryId=category-1&status=PUBLISHED&featured=true&query=java',
    );
    expect(request.request.withCredentials).toBeTrue();
    request.flush([]);
  });

  it('uses csrf before writing a category', () => {
    service
      .createCategory({
        publicationStatus: 'DRAFT',
        icon: null,
        displayOrder: 10,
        translations: [{ languageCode: 'fr', name: 'Backend', description: null }],
      })
      .subscribe((category) => expect(category.id).toBe('category-1'));

    const request = http.expectOne('/api/v1/admin/skill-categories');
    expect(request.request.method).toBe('POST');
    expect(request.request.withCredentials).toBeTrue();
    request.flush({
      id: 'category-1',
      publicationStatus: 'DRAFT',
      icon: null,
      displayOrder: 10,
      skillCount: 0,
      createdAt: '2026-07-26T00:00:00Z',
      updatedAt: '2026-07-26T00:00:00Z',
      translations: [{ languageCode: 'fr', name: 'Backend', description: null }],
    });
  });
});
