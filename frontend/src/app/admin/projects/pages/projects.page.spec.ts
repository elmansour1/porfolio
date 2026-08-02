import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { SkillsApiService } from '../../skills/api/skills-api.service';
import { ProjectApiService } from '../api/project-api.service';
import { ProjectsPage } from './projects.page';

describe('ProjectsPage', () => {
  let fixture: ComponentFixture<ProjectsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsPage, NoopAnimationsModule],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: ProjectApiService,
          useValue: {
            list: () =>
              of({ items: [], page: 0, size: 20, totalItems: 0, totalPages: 0 }),
            metadata: () =>
              of({
                publicationStatuses: [
                  { label: 'Brouillon', value: 'DRAFT' },
                  { label: 'Publié', value: 'PUBLISHED' },
                  { label: 'Archivé', value: 'ARCHIVED' },
                ],
                projectTypes: [{ label: 'Application SaaS', value: 'SAAS_APPLICATION' }],
                realStatuses: [{ label: 'Terminé', value: 'COMPLETED' }],
                confidentialityLevels: [{ label: 'Public', value: 'PUBLIC' }],
              }),
            create: jasmine.createSpy('create'),
            update: jasmine.createSpy('update'),
            delete: jasmine.createSpy('delete'),
            publish: jasmine.createSpy('publish'),
            unpublish: jasmine.createSpy('unpublish'),
            archive: jasmine.createSpy('archive'),
          },
        },
        {
          provide: SkillsApiService,
          useValue: { getSkills: () => of([]) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsPage);
    fixture.detectChanges();
  });

  it('renders the projects list with PrimeNG filters and no native select', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('p-select')).not.toBeNull();
    expect(element.querySelector('select')).toBeNull();
  });

  it('opens the creation dialog with PrimeNG components and no native select', () => {
    fixture.componentInstance.openProjectDialog();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('p-select')).not.toBeNull();
    expect(element.querySelector('p-multiselect')).not.toBeNull();
    expect(element.querySelector('p-datepicker')).not.toBeNull();
    expect(element.querySelector('input[type="date"]')).toBeNull();
    expect(element.querySelector('select')).toBeNull();
  });
});
