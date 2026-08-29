import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { PublicHomeApiService } from './public-home-api.service';

describe('PublicHomeApiService', () => {
  let api: PublicHomeApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(PublicHomeApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('calls only public portfolio and catalog endpoints', () => {
    api.portfolio('fr').subscribe();
    api.skills('en').subscribe();
    api.career('fr').subscribe();
    api.featuredProjects('fr').subscribe();
    api.services('fr').subscribe();
    api.workProcessSteps('en').subscribe();

    const urls = httpMock.match(() => true).map((request) => {
      expect(request.request.method).toBe('GET');
      expect(request.request.url).toMatch(/^\/api\/v1\/public\//);
      expect(request.request.url).not.toContain('/admin/');
      request.flush({});
      return request.request.url;
    });

    expect(urls).toEqual([
      '/api/v1/public/portfolio?lang=fr',
      '/api/v1/public/skills?lang=en',
      '/api/v1/public/career?lang=fr',
      '/api/v1/public/projects/featured?lang=fr',
      '/api/v1/public/services?lang=fr',
      '/api/v1/public/services/work-process/steps?lang=en',
    ]);
  });
});
