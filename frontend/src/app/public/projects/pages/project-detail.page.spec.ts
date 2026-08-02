import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ProjectApiService } from '../../../admin/projects/api/project-api.service';
import { PublicProjectDetailPage } from './project-detail.page';

describe('PublicProjectDetailPage', () => {
  let fixture: ComponentFixture<PublicProjectDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicProjectDetailPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ slug: 'demo-project' }) },
          },
        },
        {
          provide: ProjectApiService,
          useValue: {
            publicDetail: () =>
              of({
                slug: 'demo-project',
                projectType: 'SAAS_APPLICATION',
                realStatus: 'COMPLETED',
                startDate: '2026-01-01',
                endDate: null,
                ongoing: true,
                title: 'Projet de démonstration',
                summary: 'Un projet de démonstration.',
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
              }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicProjectDetailPage);
    fixture.detectChanges();
  });

  it('renders the requested project detail', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Projet de démonstration');
  });
});
