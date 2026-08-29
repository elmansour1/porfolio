import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';

import { PublicCareer } from '../../../admin/career/models/dto/career.dto';
import { PublicPortfolio } from '../../../admin/profile/models/dto/profile.dto';
import { PublicProjectSummary } from '../../../admin/projects/models/dto/project.dto';
import { PublicService, PublicWorkProcessStep } from '../../../admin/services/models/dto/service.dto';
import { PublicSkills } from '../../../admin/skills/models/dto/skills.dto';
import { HomePageData, HomeSectionError, HomeSectionKey, PublicLanguage } from '../models/home-page.model';
import { PublicHomeApiService } from './public-home-api.service';

interface SectionResult<T> {
  readonly value: T;
  readonly error: HomeSectionError | null;
}

@Injectable({ providedIn: 'root' })
export class HomePageDataService {
  private readonly publicApi = inject(PublicHomeApiService);

  load(language: PublicLanguage): Observable<HomePageData> {
    return this.publicApi.portfolio(language).pipe(
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
        this.publicApi.skills(language),
        { language, featuredSkills: [], categories: [] },
        'skills',
      ),
      career: this.loadIf(
        this.sectionVisible(portfolio, 'EXPERIENCES') || this.sectionVisible(portfolio, 'EDUCATION'),
        this.publicApi.career(language),
        { language, experiences: [], education: [], certifications: [] },
        'career',
      ),
      projects: this.loadIf(
        this.sectionVisible(portfolio, 'PROJECTS'),
        this.publicApi.featuredProjects(language),
        [],
        'projects',
      ),
      services: this.loadIf(
        this.sectionVisible(portfolio, 'SERVICES'),
        this.publicApi.services(language),
        [],
        'services',
      ),
      method: this.loadIf(
        this.sectionVisible(portfolio, 'METHOD'),
        this.publicApi.workProcessSteps(language),
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
