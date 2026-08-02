import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { AuthApiService } from '../../auth/api/auth-api.service';
import { PublicationStatus } from '../../profile/models/dto/profile.dto';
import { PageResponse } from '../../../shared/models/page-response.model';
import {
  Project,
  ProjectMediaKind,
  ProjectMetadata,
  ProjectPayload,
  PublicProject,
  PublicProjectSummary,
} from '../models/dto/project.dto';

@Injectable({ providedIn: 'root' })
export class ProjectApiService {
  private readonly http = inject(HttpClient);
  private readonly authApi = inject(AuthApiService);

  metadata(): Observable<ProjectMetadata> {
    return this.http.get<ProjectMetadata>('/api/v1/admin/projects/metadata', {
      withCredentials: true,
    });
  }

  list(status?: PublicationStatus | null, page?: number, size?: number): Observable<PageResponse<Project>> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    if (page !== undefined && page !== null) {
      params = params.set('page', String(page));
    }
    if (size !== undefined && size !== null) {
      params = params.set('size', String(size));
    }
    return this.http.get<PageResponse<Project>>('/api/v1/admin/projects', {
      params,
      withCredentials: true,
    });
  }

  detail(id: string): Observable<Project> {
    return this.http.get<Project>(`/api/v1/admin/projects/${id}`, { withCredentials: true });
  }

  create(payload: ProjectPayload): Observable<Project> {
    return this.withCsrf(
      this.http.post<Project>('/api/v1/admin/projects', payload, { withCredentials: true }),
    );
  }

  update(id: string, payload: ProjectPayload): Observable<Project> {
    return this.withCsrf(
      this.http.put<Project>(`/api/v1/admin/projects/${id}`, payload, { withCredentials: true }),
    );
  }

  delete(id: string): Observable<void> {
    return this.withCsrf(
      this.http.delete<void>(`/api/v1/admin/projects/${id}`, { withCredentials: true }),
    );
  }

  publish(id: string): Observable<Project> {
    return this.withCsrf(
      this.http.post<Project>(`/api/v1/admin/projects/${id}/publish`, null, { withCredentials: true }),
    );
  }

  unpublish(id: string): Observable<Project> {
    return this.withCsrf(
      this.http.post<Project>(`/api/v1/admin/projects/${id}/unpublish`, null, { withCredentials: true }),
    );
  }

  archive(id: string): Observable<Project> {
    return this.withCsrf(
      this.http.post<Project>(`/api/v1/admin/projects/${id}/archive`, null, { withCredentials: true }),
    );
  }

  setFeatured(id: string, value: boolean): Observable<Project> {
    const params = new HttpParams().set('value', String(value));
    return this.withCsrf(
      this.http.put<Project>(`/api/v1/admin/projects/${id}/featured`, null, {
        params,
        withCredentials: true,
      }),
    );
  }

  reorder(id: string, displayOrder: number): Observable<Project> {
    const params = new HttpParams().set('displayOrder', String(displayOrder));
    return this.withCsrf(
      this.http.put<Project>(`/api/v1/admin/projects/${id}/order`, null, {
        params,
        withCredentials: true,
      }),
    );
  }

  uploadMedia(
    id: string,
    file: File,
    kind: ProjectMediaKind,
    altText?: string,
    caption?: string,
  ): Observable<Project> {
    const form = new FormData();
    form.append('file', file);
    form.append('kind', kind);
    if (altText?.trim()) {
      form.append('altText', altText.trim());
    }
    if (caption?.trim()) {
      form.append('caption', caption.trim());
    }
    return this.withCsrf(
      this.http.post<Project>(`/api/v1/admin/projects/${id}/media`, form, { withCredentials: true }),
    );
  }

  deleteMedia(id: string, mediaId: string): Observable<Project> {
    return this.withCsrf(
      this.http.delete<Project>(`/api/v1/admin/projects/${id}/media/${mediaId}`, {
        withCredentials: true,
      }),
    );
  }

  reorderGalleryMedia(id: string, orderedMediaIds: readonly string[]): Observable<Project> {
    return this.withCsrf(
      this.http.put<Project>(`/api/v1/admin/projects/${id}/media/order`, orderedMediaIds, {
        withCredentials: true,
      }),
    );
  }

  publicList(
    language: 'fr' | 'en',
    page?: number,
    size?: number,
    skillId?: string | null,
  ): Observable<PageResponse<PublicProjectSummary>> {
    let params = new HttpParams().set('lang', language);
    if (page !== undefined && page !== null) {
      params = params.set('page', String(page));
    }
    if (size !== undefined && size !== null) {
      params = params.set('size', String(size));
    }
    if (skillId) {
      params = params.set('skillId', skillId);
    }
    return this.http.get<PageResponse<PublicProjectSummary>>('/api/v1/public/projects', { params });
  }

  publicFeatured(language: 'fr' | 'en'): Observable<PublicProjectSummary[]> {
    return this.http.get<PublicProjectSummary[]>(`/api/v1/public/projects/featured?lang=${language}`);
  }

  publicDetail(slug: string, language: 'fr' | 'en'): Observable<PublicProject> {
    return this.http.get<PublicProject>(
      `/api/v1/public/projects/${slug}?lang=${language}`,
    );
  }

  private withCsrf<T>(request: Observable<T>): Observable<T> {
    return this.authApi.csrf().pipe(switchMap(() => request));
  }
}
