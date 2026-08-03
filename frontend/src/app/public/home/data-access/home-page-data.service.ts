import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';

import { CareerApiService } from '../../../admin/career/api/career-api.service';
import { PublicCareer } from '../../../admin/career/models/dto/career.dto';
import { ProfileApiService } from '../../../admin/profile/api/profile-api.service';
import { PublicPortfolio } from '../../../admin/profile/models/dto/profile.dto';
import { ProjectApiService } from '../../../admin/projects/api/project-api.service';
import { PublicProjectSummary } from '../../../admin/projects/models/dto/project.dto';
import { ServicesApiService } from '../../../admin/services/api/services-api.service';
import { PublicService, PublicWorkProcessStep } from '../../../admin/services/models/dto/service.dto';
import { SkillsApiService } from '../../../admin/skills/api/skills-api.service';
import { PublicSkills } from '../../../admin/skills/models/dto/skills.dto';
import { HomePageData, HomeSectionError, HomeSectionKey, PublicLanguage } from '../models/home-page.model';

interface SectionResult<T> {
  readonly value: T;
  readonly error: HomeSectionError | null;
}

@Injectable({ providedIn: 'root' })
export class HomePageDataService {
  private readonly profileApi = inject(ProfileApiService);
  private readonly skillsApi = inject(SkillsApiService);
  private readonly careerApi = inject(CareerApiService);
  private readonly projectApi = inject(ProjectApiService);
  private readonly servicesApi = inject(ServicesApiService);

  load(language: PublicLanguage): Observable<HomePageData> {
    return this.profileApi.publicPortfolio(language).pipe(
      switchMap((portfolio) => this.loadVisibleSections(portfolio, language)),
      catchError(() => of(this.empty(language, ['portfolio']))),
    );
  }

  sectionVisible(portfolio: PublicPortfolio | null, key: HomeSectionKey): boolean {
    const setting = portfolio?.sections.find((section) => section.sectionKey === key);
    return setting ? setting.visible : true;
  }

  private loadVisibleSections(
    portfolio: PublicPortfolio,
    language: PublicLanguage,
  ): Observable<HomePageData> {
    return forkJoin({
      skills: this.loadIf(
        this.sectionVisible(portfolio, 'SKILLS'),
        this.skillsApi.publicSkills(language),
        { language, featuredSkills: [], categories: [] },
        'skills',
      ),
      career: this.loadIf(
        this.sectionVisible(portfolio, 'EXPERIENCES') || this.sectionVisible(portfolio, 'EDUCATION'),
        this.careerApi.publicCareer(language),
        { language, experiences: [], education: [], certifications: [] },
        'career',
      ),
      projects: this.loadIf(
        this.sectionVisible(portfolio, 'PROJECTS'),
        this.projectApi.publicFeatured(language),
        [],
        'projects',
      ),
      services: this.loadIf(
        this.sectionVisible(portfolio, 'SERVICES'),
        this.servicesApi.publicServices(language),
        [],
        'services',
      ),
      method: this.loadIf(
        this.sectionVisible(portfolio, 'METHOD'),
        this.servicesApi.publicWorkProcessSteps(language),
        [],
        'method',
      ),
    }).pipe(
      map((sections) => ({
        language,
        portfolio,
        skills: sections.skills.value,
        career: sections.career.value,
        featuredProjects: sections.projects.value,
        services: sections.services.value,
        workProcessSteps: sections.method.value,
        errors: this.errors(sections),
      })),
    );
  }

  private loadIf<T>(
    condition: boolean,
    source$: Observable<T>,
    fallback: T,
    error: HomeSectionError,
  ): Observable<SectionResult<T>> {
    if (!condition) {
      return of({ value: fallback, error: null });
    }
    return source$.pipe(
      map((value) => ({ value, error: null })),
      catchError(() => of({ value: fallback, error })),
    );
  }

  private errors(sections: {
    readonly skills: SectionResult<PublicSkills>;
    readonly career: SectionResult<PublicCareer>;
    readonly projects: SectionResult<readonly PublicProjectSummary[]>;
    readonly services: SectionResult<readonly PublicService[]>;
    readonly method: SectionResult<readonly PublicWorkProcessStep[]>;
  }): readonly HomeSectionError[] {
    return Object.values(sections)
      .map((section) => section.error)
      .filter((error): error is HomeSectionError => error !== null);
  }

  private empty(language: PublicLanguage, errors: readonly HomeSectionError[]): HomePageData {
    return {
      language,
      portfolio: null,
      skills: null,
      career: null,
      featuredProjects: [],
      services: [],
      workProcessSteps: [],
      errors,
    };
  }
}
