import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { SkillsApiService } from '../api/skills-api.service';
import { SkillsPage } from './skills.page';

describe('SkillsPage', () => {
  const category = {
    id: 'category-1',
    publicationStatus: 'PUBLISHED' as const,
    icon: 'pi pi-server',
    displayOrder: 10,
    skillCount: 1,
    createdAt: '2026-07-26T00:00:00Z',
    updatedAt: '2026-07-26T00:00:00Z',
    translations: [
      { languageCode: 'fr' as const, name: 'Backend', description: 'APIs' },
      { languageCode: 'en' as const, name: 'Backend', description: 'APIs' },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsPage, NoopAnimationsModule],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: SkillsApiService,
          useValue: {
            getCategories: () => of([category]),
            getSkills: () =>
              of([
                {
                  id: 'skill-1',
                  categoryId: 'category-1',
                  categoryNameFr: 'Backend',
                  publicationStatus: 'PUBLISHED',
                  level: 'CORE_EXPERTISE',
                  icon: 'pi pi-code',
                  featured: true,
                  visible: true,
                  displayOrder: 10,
                  createdAt: '2026-07-26T00:00:00Z',
                  updatedAt: '2026-07-26T00:00:00Z',
                  translations: [
                    {
                      languageCode: 'fr',
                      name: 'Java',
                      description: 'Backend robuste',
                      usageSummary: 'API REST',
                    },
                  ],
                },
              ]),
            getMetadata: () =>
              of({
                publicationStatuses: [
                  { label: 'Brouillon', value: 'DRAFT' },
                  { label: 'Publié', value: 'PUBLISHED' },
                  { label: 'Archivé', value: 'ARCHIVED' },
                ],
                levels: [{ label: 'Expertise principale', value: 'CORE_EXPERTISE' }],
              }),
          },
        },
      ],
    }).compileComponents();
  });

  it('renders skill tables and PrimeNG selects without native selects', () => {
    const fixture = TestBed.createComponent(SkillsPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Compétences et catégories');
    expect(compiled.textContent).toContain('Backend');
    expect(compiled.textContent).toContain('Java');
    expect(compiled.querySelector('p-select')).not.toBeNull();
    expect(compiled.querySelector('select')).toBeNull();
  });
});
