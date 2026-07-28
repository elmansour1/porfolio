import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { AuthApiService } from '../../auth/api/auth-api.service';
import {
  PublicSkills,
  Skill,
  SkillCategory,
  SkillCategoryPayload,
  SkillFilters,
  SkillMetadata,
  SkillPayload,
} from '../models/dto/skills.dto';

@Injectable({ providedIn: 'root' })
export class SkillsApiService {
  private readonly http = inject(HttpClient);
  private readonly authApi = inject(AuthApiService);

  getCategories(): Observable<SkillCategory[]> {
    return this.http.get<SkillCategory[]>('/api/v1/admin/skill-categories', {
      withCredentials: true,
    });
  }

  createCategory(payload: SkillCategoryPayload): Observable<SkillCategory> {
    return this.withCsrf(
      this.http.post<SkillCategory>('/api/v1/admin/skill-categories', payload, {
        withCredentials: true,
      }),
    );
  }

  updateCategory(id: string, payload: SkillCategoryPayload): Observable<SkillCategory> {
    return this.withCsrf(
      this.http.put<SkillCategory>(`/api/v1/admin/skill-categories/${id}`, payload, {
        withCredentials: true,
      }),
    );
  }

  deleteCategory(id: string): Observable<void> {
    return this.withCsrf(
      this.http.delete<void>(`/api/v1/admin/skill-categories/${id}`, { withCredentials: true }),
    );
  }

  getSkills(filters: SkillFilters = {}): Observable<Skill[]> {
    let params = new HttpParams();
    if (filters.categoryId) {
      params = params.set('categoryId', filters.categoryId);
    }
    if (filters.status) {
      params = params.set('status', filters.status);
    }
    if (filters.featured !== null && filters.featured !== undefined) {
      params = params.set('featured', String(filters.featured));
    }
    if (filters.query?.trim()) {
      params = params.set('query', filters.query.trim());
    }
    return this.http.get<Skill[]>('/api/v1/admin/skills', { params, withCredentials: true });
  }

  getMetadata(): Observable<SkillMetadata> {
    return this.http.get<SkillMetadata>('/api/v1/admin/skills/metadata', {
      withCredentials: true,
    });
  }

  createSkill(payload: SkillPayload): Observable<Skill> {
    return this.withCsrf(
      this.http.post<Skill>('/api/v1/admin/skills', payload, { withCredentials: true }),
    );
  }

  updateSkill(id: string, payload: SkillPayload): Observable<Skill> {
    return this.withCsrf(
      this.http.put<Skill>(`/api/v1/admin/skills/${id}`, payload, { withCredentials: true }),
    );
  }

  deleteSkill(id: string): Observable<void> {
    return this.withCsrf(
      this.http.delete<void>(`/api/v1/admin/skills/${id}`, { withCredentials: true }),
    );
  }

  publicSkills(language: 'fr' | 'en'): Observable<PublicSkills> {
    return this.http.get<PublicSkills>(`/api/v1/public/skills?lang=${language}`);
  }

  private withCsrf<T>(request: Observable<T>): Observable<T> {
    return this.authApi.csrf().pipe(switchMap(() => request));
  }
}
