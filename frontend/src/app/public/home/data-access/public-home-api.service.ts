import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { PublicCareer } from '../../../admin/career/models/dto/career.dto';
import { PublicPortfolio } from '../../../admin/profile/models/dto/profile.dto';
import { PublicProjectSummary } from '../../../admin/projects/models/dto/project.dto';
import { PublicService, PublicWorkProcessStep } from '../../../admin/services/models/dto/service.dto';
import { PublicSkills } from '../../../admin/skills/models/dto/skills.dto';
import { PublicLanguage } from '../models/home-page.model';

/**
 * Lecture publique uniquement. N'importe aucun service admin (CSRF, mutations).
 */
@Injectable({ providedIn: 'root' })
export class PublicHomeApiService {
  private readonly http = inject(HttpClient);

  portfolio(language: PublicLanguage): Observable<PublicPortfolio> {
    return this.http.get<PublicPortfolio>(`/api/v1/public/portfolio?lang=${language}`);
  }

  skills(language: PublicLanguage): Observable<PublicSkills> {
    return this.http.get<PublicSkills>(`/api/v1/public/skills?lang=${language}`);
  }

  career(language: PublicLanguage): Observable<PublicCareer> {
    return this.http.get<PublicCareer>(`/api/v1/public/career?lang=${language}`);
  }

  featuredProjects(language: PublicLanguage): Observable<PublicProjectSummary[]> {
    return this.http.get<PublicProjectSummary[]>(`/api/v1/public/projects/featured?lang=${language}`);
  }

  services(language: PublicLanguage): Observable<PublicService[]> {
    return this.http.get<PublicService[]>(`/api/v1/public/services?lang=${language}`);
  }

  workProcessSteps(language: PublicLanguage): Observable<PublicWorkProcessStep[]> {
    return this.http.get<PublicWorkProcessStep[]>(
      `/api/v1/public/services/work-process/steps?lang=${language}`,
    );
  }
}
