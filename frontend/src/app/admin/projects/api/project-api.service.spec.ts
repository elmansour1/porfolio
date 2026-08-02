import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AuthApiService } from '../../auth/api/auth-api.service';
import { ProjectApiService } from './project-api.service';

describe('ProjectApiService', () => {
  let service: ProjectApiService;
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
    service = TestBed.inject(ProjectApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads paginated admin projects with credentials', () => {
    service.list('PUBLISHED', 0, 20).subscribe((page) => expect(page.items).toEqual([]));

    const request = http.expectOne('/api/v1/admin/projects?status=PUBLISHED&page=0&size=20');
    expect(request.request.method).toBe('GET');
    expect(request.request.withCredentials).toBeTrue();
    request.flush({ items: [], page: 0, size: 20, totalItems: 0, totalPages: 0 });
  });

  it('uses csrf before publishing a project', () => {
    service.publish('project-1').subscribe((project) => expect(project.id).toBe('project-1'));

    const request = http.expectOne('/api/v1/admin/projects/project-1/publish');
    expect(request.request.method).toBe('POST');
    expect(request.request.withCredentials).toBeTrue();
    request.flush({
      id: 'project-1',
      slug: 'project-1',
      projectType: 'SAAS_APPLICATION',
      realStatus: 'COMPLETED',
      publicationStatus: 'PUBLISHED',
      confidentiality: 'PUBLIC',
      startDate: null,
      endDate: null,
      ongoing: false,
      featured: false,
      displayOrder: 0,
      demoUrl: null,
      githubUrl: null,
      indexable: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      translations: [],
      skills: [],
      links: [],
      media: [],
    });
  });

  it('loads the public featured projects by language without admin credentials', () => {
    service.publicFeatured('en').subscribe((projects) => expect(projects).toEqual([]));

    const request = http.expectOne('/api/v1/public/projects/featured?lang=en');
    expect(request.request.method).toBe('GET');
    expect(request.request.withCredentials).toBeFalsy();
    request.flush([]);
  });

  it('loads a public project detail by slug and language', () => {
    service.publicDetail('my-project', 'fr').subscribe((project) => expect(project.slug).toBe('my-project'));

    const request = http.expectOne('/api/v1/public/projects/my-project?lang=fr');
    expect(request.request.method).toBe('GET');
    expect(request.request.withCredentials).toBeFalsy();
    request.flush({
      slug: 'my-project',
      projectType: 'SAAS_APPLICATION',
      realStatus: 'COMPLETED',
      startDate: null,
      endDate: null,
      ongoing: false,
      title: 'Mon projet',
      summary: null,
      description: null,
      context: null,
      problem: null,
      objectives: null,
      targetUsers: null,
      role: null,
      responsibilities: null,
      solution: null,
      architectureNotes: null,
      features: null,
      challenges: null,
      decisions: null,
      results: null,
      seoTitle: null,
      seoDescription: null,
      coverUrl: null,
      gallery: [],
      skills: [],
      links: [],
      demoUrl: null,
      githubUrl: null,
      similarProjects: [],
    });
  });
});
