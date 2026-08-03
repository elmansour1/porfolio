import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { AuthApiService } from '../../auth/api/auth-api.service';
import { PublicationStatus } from '../../profile/models/dto/profile.dto';
import { PageResponse } from '../../../shared/models/page-response.model';
import {
  PublicService,
  PublicWorkProcessStep,
  ServiceAdminDetail,
  ServiceAdminSummary,
  ServiceMetadata,
  ServicePayload,
  WorkProcessStep,
  WorkProcessStepPayload,
} from '../models/dto/service.dto';

@Injectable({ providedIn: 'root' })
export class ServicesApiService {
  private readonly http = inject(HttpClient);
  private readonly authApi = inject(AuthApiService);

  metadata(): Observable<ServiceMetadata> {
    return this.http.get<ServiceMetadata>('/api/v1/admin/services/metadata', {
      withCredentials: true,
    });
  }

  list(
    status?: PublicationStatus | null,
    featured?: boolean | null,
    page?: number,
    size?: number,
  ): Observable<PageResponse<ServiceAdminSummary>> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    if (featured !== undefined && featured !== null) {
      params = params.set('featured', String(featured));
    }
    if (page !== undefined && page !== null) {
      params = params.set('page', String(page));
    }
    if (size !== undefined && size !== null) {
      params = params.set('size', String(size));
    }
    return this.http.get<PageResponse<ServiceAdminSummary>>('/api/v1/admin/services', {
      params,
      withCredentials: true,
    });
  }

  detail(id: string): Observable<ServiceAdminDetail> {
    return this.http.get<ServiceAdminDetail>(`/api/v1/admin/services/${id}`, {
      withCredentials: true,
    });
  }

  create(payload: ServicePayload): Observable<ServiceAdminDetail> {
    return this.withCsrf(
      this.http.post<ServiceAdminDetail>('/api/v1/admin/services', payload, {
        withCredentials: true,
      }),
    );
  }

  update(id: string, payload: ServicePayload): Observable<ServiceAdminDetail> {
    return this.withCsrf(
      this.http.put<ServiceAdminDetail>(`/api/v1/admin/services/${id}`, payload, {
        withCredentials: true,
      }),
    );
  }

  publish(id: string): Observable<ServiceAdminDetail> {
    return this.withCsrf(
      this.http.post<ServiceAdminDetail>(`/api/v1/admin/services/${id}/publish`, {}, {
        withCredentials: true,
      }),
    );
  }

  unpublish(id: string): Observable<ServiceAdminDetail> {
    return this.withCsrf(
      this.http.post<ServiceAdminDetail>(`/api/v1/admin/services/${id}/unpublish`, null, {
        withCredentials: true,
      }),
    );
  }

  archive(id: string): Observable<ServiceAdminDetail> {
    return this.withCsrf(
      this.http.post<ServiceAdminDetail>(`/api/v1/admin/services/${id}/archive`, {}, {
        withCredentials: true,
      }),
    );
  }

  setFeatured(id: string, value: boolean): Observable<ServiceAdminDetail> {
    const params = new HttpParams().set('value', String(value));
    return this.withCsrf(
      this.http.put<ServiceAdminDetail>(`/api/v1/admin/services/${id}/featured`, null, {
        params,
        withCredentials: true,
      }),
    );
  }

  reorder(orderedIds: readonly string[]): Observable<ServiceAdminSummary[]> {
    return this.withCsrf(
      this.http.put<ServiceAdminSummary[]>('/api/v1/admin/services/order', { orderedIds }, {
        withCredentials: true,
      }),
    );
  }

  steps(): Observable<WorkProcessStep[]> {
    return this.http.get<WorkProcessStep[]>('/api/v1/admin/work-process-steps', {
      withCredentials: true,
    });
  }

  createStep(payload: WorkProcessStepPayload): Observable<WorkProcessStep> {
    return this.withCsrf(
      this.http.post<WorkProcessStep>('/api/v1/admin/work-process-steps', payload, {
        withCredentials: true,
      }),
    );
  }

  updateStep(id: string, payload: WorkProcessStepPayload): Observable<WorkProcessStep> {
    return this.withCsrf(
      this.http.put<WorkProcessStep>(`/api/v1/admin/work-process-steps/${id}`, payload, {
        withCredentials: true,
      }),
    );
  }

  publishStep(id: string): Observable<WorkProcessStep> {
    return this.withCsrf(
      this.http.post<WorkProcessStep>(`/api/v1/admin/work-process-steps/${id}/publish`, {}, {
        withCredentials: true,
      }),
    );
  }

  unpublishStep(id: string): Observable<WorkProcessStep> {
    return this.withCsrf(
      this.http.post<WorkProcessStep>(`/api/v1/admin/work-process-steps/${id}/unpublish`, null, {
        withCredentials: true,
      }),
    );
  }

  archiveStep(id: string): Observable<WorkProcessStep> {
    return this.withCsrf(
      this.http.post<WorkProcessStep>(`/api/v1/admin/work-process-steps/${id}/archive`, null, {
        withCredentials: true,
      }),
    );
  }

  reorderSteps(orderedIds: readonly string[]): Observable<WorkProcessStep[]> {
    return this.withCsrf(
      this.http.put<WorkProcessStep[]>('/api/v1/admin/work-process-steps/order', { orderedIds }, {
        withCredentials: true,
      }),
    );
  }

  publicServices(language: 'fr' | 'en'): Observable<PublicService[]> {
    return this.http.get<PublicService[]>(`/api/v1/public/services?lang=${language}`);
  }

  publicWorkProcessSteps(language: 'fr' | 'en'): Observable<PublicWorkProcessStep[]> {
    return this.http.get<PublicWorkProcessStep[]>(
      `/api/v1/public/services/work-process/steps?lang=${language}`,
    );
  }

  private withCsrf<T>(request: Observable<T>): Observable<T> {
    return this.authApi.csrf().pipe(switchMap(() => request));
  }
}
