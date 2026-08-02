import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ProfileApiService } from '../admin/profile/api/profile-api.service';
import { CareerApiService } from '../admin/career/api/career-api.service';
import { ProjectApiService } from '../admin/projects/api/project-api.service';
import { SkillsApiService } from '../admin/skills/api/skills-api.service';
import { PublicPlaceholderPage } from './public-placeholder.page';

describe('PublicPlaceholderPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicPlaceholderPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: ProfileApiService,
          useValue: {
            publicPortfolio: () =>
              of({
                profilePublished: false,
                language: 'fr',
                settings: {
                  publicSiteName: 'Portfolio professionnel',
                  monogram: 'FE',
                  defaultLanguage: 'fr',
                  activeLanguages: ['fr', 'en'],
                  footerCopyright: null,
                  maintenanceMode: false,
                  logoUrl: null,
                  faviconUrl: null,
                },
                profile: null,
                sections: [],
              }),
          },
        },
        {
          provide: SkillsApiService,
          useValue: {
            publicSkills: () => of({ language: 'fr', featuredSkills: [], categories: [] }),
          },
        },
        {
          provide: CareerApiService,
          useValue: {
            publicCareer: () => of({ language: 'fr', experiences: [], education: [], certifications: [] }),
          },
        },
        {
          provide: ProjectApiService,
          useValue: {
            publicFeatured: () => of([]),
          },
        },
      ],
    }).compileComponents();
  });

  it('renders the public unpublished profile state', () => {
    const fixture = TestBed.createComponent(PublicPlaceholderPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Profil non publié');
  });
});
