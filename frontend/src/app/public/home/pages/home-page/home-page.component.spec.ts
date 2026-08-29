import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { HomePageDataService } from '../../data-access/home-page-data.service';
import { HomePageData, HomeSectionKey, PublicLanguage } from '../../models/home-page.model';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let currentData: HomePageData;
  let dataService: jasmine.SpyObj<HomePageDataService>;

  beforeEach(async () => {
    currentData = buildHomeData();
    dataService = jasmine.createSpyObj<HomePageDataService>('HomePageDataService', [
      'load',
      'sectionVisible',
    ]);
    dataService.load.and.callFake((language: PublicLanguage) =>
      of({ ...currentData, language }),
    );
    dataService.sectionVisible.and.callFake((_, key: HomeSectionKey) => {
      const setting = currentData.portfolio?.sections.find((section) => section.sectionKey === key);
      return setting ? setting.visible : true;
    });

    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
        { provide: HomePageDataService, useValue: dataService },
      ],
    }).compileComponents();
  });

  it('renders the public landing sections from published data', () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Faouzi Elmali');
    expect(compiled.textContent).toContain('Développeur Full Stack');
    expect(compiled.textContent).toContain('Stack & compétences');
    expect(compiled.textContent).toContain('Projet vitrine');
    expect(compiled.textContent).toContain('Services professionnels');
    expect(compiled.textContent).toContain('Méthode de travail');
    expect(compiled.querySelectorAll('.home-method-card').length).toBeGreaterThan(0);
    expect(compiled.querySelector('.home-method-list')).toBeNull();
    expect(compiled.querySelector('.home-contact-form')).not.toBeNull();
  });

  it('hides a disabled public section', () => {
    currentData = buildHomeData([
      { sectionKey: 'SERVICES', label: 'Services', displayOrder: 9, visible: false },
    ]);

    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('Services professionnels');
  });

  it('hides the hero when the hero section is disabled', () => {
    currentData = buildHomeData([
      { sectionKey: 'HERO', label: 'Hero', displayOrder: 1, visible: false },
    ]);

    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.home-hero')).toBeNull();
    expect(compiled.textContent).not.toContain('Faouzi Elmali');
  });

  it('does not render contact links when the contact section is disabled', () => {
    currentData = buildHomeData([
      { sectionKey: 'CONTACT', label: 'Contact', displayOrder: 10, visible: false },
    ]);

    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#contact')).toBeNull();
    expect(Array.from(compiled.querySelectorAll('a[href="#contact"]')).length).toBe(0);
  });

  it('respects separate experience and education visibility flags', () => {
    currentData = {
      ...buildHomeData([
        { sectionKey: 'EXPERIENCES', label: 'Expériences', displayOrder: 4, visible: false },
        { sectionKey: 'EDUCATION', label: 'Formations', displayOrder: 5, visible: true },
      ]),
      career: {
        language: 'fr',
        experiences: [
          {
            organization: 'Organisation',
            roleTitle: 'Développeur',
            location: 'Douala',
            startDate: '2024-01',
            endDate: null,
            currentPosition: true,
            confidential: false,
            summary: 'Développement applicatif.',
            missions: null,
            achievements: null,
            skills: [],
          },
        ],
        education: [
          {
            institution: 'Université',
            title: 'Licence informatique',
            field: 'Informatique',
            startDate: '2020-01',
            endDate: '2023-01',
            currentEducation: false,
            description: null,
            url: null,
          },
        ],
        certifications: [],
      },
    };

    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent || '';
    expect(text).not.toContain('Développement applicatif.');
    expect(text).toContain('Licence informatique');
  });

  it('keeps the landing available when a secondary section fails', () => {
    currentData = { ...buildHomeData(), skills: null, errors: ['skills'] };

    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent || '';
    expect(text).toContain('Faouzi Elmali');
    expect(text).toContain('Une section n’a pas pu être chargée');
    expect(text).toContain('Services professionnels');
  });

  it('does not render contact links when the public portfolio fails to load', () => {
    currentData = { ...buildHomeData(), portfolio: null, errors: ['portfolio'] };

    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#contact')).toBeNull();
    expect(Array.from(compiled.querySelectorAll('a[href="#contact"]')).length).toBe(0);
    expect(compiled.textContent).toContain('Portfolio en cours de préparation');
  });

  it('reloads public data when the language changes', () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const englishButton = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('.home-header__languages button'),
    ).find((button) => button.textContent?.trim() === 'EN') as HTMLButtonElement;

    englishButton.click();
    fixture.detectChanges();

    expect(dataService.load).toHaveBeenCalledWith('fr');
    expect(dataService.load).toHaveBeenCalledWith('en');
  });
});

function buildHomeData(
  sections: NonNullable<HomePageData['portfolio']>['sections'] = [],
): HomePageData {
  return {
    language: 'fr',
    errors: [],
    portfolio: {
      profilePublished: true,
      language: 'fr',
      settings: {
        publicSiteName: 'Portfolio professionnel',
        monogram: 'FE',
        defaultLanguage: 'fr',
        activeLanguages: ['fr', 'en'],
        footerCopyright: '2026',
        maintenanceMode: false,
        logoUrl: null,
        faviconUrl: null,
      },
      profile: {
        displayName: 'Faouzi Elmali',
        firstName: 'Faouzi',
        lastName: 'Elmali',
        location: 'Douala',
        country: 'Cameroun',
        availabilityStatus: 'AVAILABLE',
        availabilityLabel: 'Disponible',
        professionalTitle: 'Développeur Full Stack',
        tagline: 'Applications web maintenables',
        shortSummary: 'Je conçois des applications web sobres et maintenables.',
        biography: null,
        aboutText: 'Profil technique orienté produit et qualité logicielle.',
        professionalEmail: 'contact@example.com',
        phone: null,
        photoUrl: null,
        photoAltText: null,
        cvUrl: null,
        primaryCtaLabel: 'Voir les projets',
        primaryCtaUrl: '/projects',
        secondaryCtaLabel: 'Contact',
        secondaryCtaUrl: null,
        footerText: null,
        links: [],
        statistics: [{ value: '5+', label: 'années de pratique' }],
      },
      sections,
    },
    skills: {
      language: 'fr',
      featuredSkills: [
        {
          name: 'Angular',
          description: null,
          usageSummary: null,
          level: 'ADVANCED',
          icon: null,
          featured: true,
          displayOrder: 1,
        },
      ],
      categories: [
        {
          name: 'Frontend',
          description: 'Interfaces web.',
          icon: null,
          displayOrder: 1,
          skills: [
            {
              name: 'Angular',
              description: null,
              usageSummary: null,
              level: 'ADVANCED',
              icon: null,
              featured: true,
              displayOrder: 1,
            },
          ],
        },
      ],
    },
    career: {
      language: 'fr',
      experiences: [
        {
          organization: 'Organisation',
          roleTitle: 'Développeur',
          location: 'Douala',
          startDate: '2024-01',
          endDate: null,
          currentPosition: true,
          confidential: false,
          summary: 'Développement applicatif.',
          missions: null,
          achievements: null,
          skills: [{ id: 'skill-1', name: 'Java', categoryName: 'Backend' }],
        },
      ],
      education: [],
      certifications: [],
    },
    featuredProjects: [
      {
        slug: 'projet-vitrine',
        projectType: 'SAAS_APPLICATION',
        realStatus: 'COMPLETED',
        title: 'Projet vitrine',
        summary: 'Projet publié.',
        coverUrl: null,
        startDate: null,
        endDate: null,
        ongoing: false,
        featured: true,
        skills: [{ id: 'skill-1', name: 'Java', categoryName: 'Backend' }],
      },
    ],
    services: [
      {
        slug: 'backend-spring',
        title: 'Développement backend Java',
        summary: 'Conception de services applicatifs.',
        description: null,
        problem: 'Clarifier la logique métier.',
        targetAudience: null,
        icon: null,
        visualUrl: null,
        featured: true,
        displayOrder: 1,
        ctaType: 'CONTACT',
        ctaTarget: null,
        ctaLabel: 'Discuter du besoin',
        benefits: [{ label: 'API documentée', description: null, displayOrder: 1 }],
        deliverables: [],
        technologies: [{ id: 'skill-1', name: 'Spring Boot', categoryName: 'Backend' }],
        skills: [],
      },
    ],
    workProcessSteps: [
      {
        title: 'Cadrage',
        description: 'Compréhension du besoin.',
        expectedResult: 'Périmètre clair',
        displayOrder: 1,
        icon: null,
      },
    ],
  };
}
