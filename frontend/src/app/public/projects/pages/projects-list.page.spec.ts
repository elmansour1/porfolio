import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ProjectApiService } from '../../../admin/projects/api/project-api.service';
import { PublicProjectsListPage } from './projects-list.page';

describe('PublicProjectsListPage', () => {
  let fixture: ComponentFixture<PublicProjectsListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicProjectsListPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: ProjectApiService,
          useValue: {
            publicList: () =>
              of({
                items: [
                  {
                    slug: 'demo-project',
                    projectType: 'SAAS_APPLICATION',
                    realStatus: 'COMPLETED',
                    title: 'Projet de démonstration',
                    summary: 'Un projet de démonstration.',
                    coverUrl: null,
                    startDate: '2026-01-01',
                    endDate: null,
                    ongoing: true,
                    featured: true,
                    skills: [],
                  },
                ],
                page: 0,
                size: 9,
                totalItems: 1,
                totalPages: 1,
              }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicProjectsListPage);
    fixture.detectChanges();
  });

  it('renders the published projects list', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Projet de démonstration');
  });
});
