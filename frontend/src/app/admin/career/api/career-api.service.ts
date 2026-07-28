import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { AuthApiService } from '../../auth/api/auth-api.service';
import { PublicationStatus } from '../../profile/models/dto/profile.dto';
import {
  CareerCertification,
  CareerCertificationPayload,
  CareerEducation,
  CareerEducationPayload,
  CareerExperience,
  CareerExperiencePayload,
  CareerMetadata,
  PublicCareer,
} from '../models/dto/career.dto';

@Injectable({ providedIn: 'root' })
export class CareerApiService {
  private readonly http = inject(HttpClient);
  private readonly authApi = inject(AuthApiService);

  metadata(): Observable<CareerMetadata> {
    return this.http.get<CareerMetadata>('/api/v1/admin/career/metadata', { withCredentials: true });
  }

  experiences(status?: PublicationStatus | null): Observable<CareerExperience[]> {
    return this.http.get<CareerExperience[]>('/api/v1/admin/experiences', {
      params: this.statusParams(status),
      withCredentials: true,
    });
  }

  createExperience(payload: CareerExperiencePayload): Observable<CareerExperience> {
    return this.withCsrf(
      this.http.post<CareerExperience>('/api/v1/admin/experiences', payload, {
        withCredentials: true,
      }),
    );
  }

  updateExperience(id: string, payload: CareerExperiencePayload): Observable<CareerExperience> {
    return this.withCsrf(
      this.http.put<CareerExperience>(`/api/v1/admin/experiences/${id}`, payload, {
        withCredentials: true,
      }),
    );
  }

  deleteExperience(id: string): Observable<void> {
    return this.withCsrf(
      this.http.delete<void>(`/api/v1/admin/experiences/${id}`, { withCredentials: true }),
    );
  }

  education(status?: PublicationStatus | null): Observable<CareerEducation[]> {
    return this.http.get<CareerEducation[]>('/api/v1/admin/education', {
      params: this.statusParams(status),
      withCredentials: true,
    });
  }

  createEducation(payload: CareerEducationPayload): Observable<CareerEducation> {
    return this.withCsrf(
      this.http.post<CareerEducation>('/api/v1/admin/education', payload, { withCredentials: true }),
    );
  }

  updateEducation(id: string, payload: CareerEducationPayload): Observable<CareerEducation> {
    return this.withCsrf(
      this.http.put<CareerEducation>(`/api/v1/admin/education/${id}`, payload, {
        withCredentials: true,
      }),
    );
  }

  deleteEducation(id: string): Observable<void> {
    return this.withCsrf(
      this.http.delete<void>(`/api/v1/admin/education/${id}`, { withCredentials: true }),
    );
  }

  certifications(status?: PublicationStatus | null): Observable<CareerCertification[]> {
    return this.http.get<CareerCertification[]>('/api/v1/admin/certifications', {
      params: this.statusParams(status),
      withCredentials: true,
    });
  }

  createCertification(payload: CareerCertificationPayload): Observable<CareerCertification> {
    return this.withCsrf(
      this.http.post<CareerCertification>('/api/v1/admin/certifications', payload, {
        withCredentials: true,
      }),
    );
  }

  updateCertification(id: string, payload: CareerCertificationPayload): Observable<CareerCertification> {
    return this.withCsrf(
      this.http.put<CareerCertification>(`/api/v1/admin/certifications/${id}`, payload, {
        withCredentials: true,
      }),
    );
  }

  deleteCertification(id: string): Observable<void> {
    return this.withCsrf(
      this.http.delete<void>(`/api/v1/admin/certifications/${id}`, { withCredentials: true }),
    );
  }

  publicCareer(language: 'fr' | 'en'): Observable<PublicCareer> {
    return this.http.get<PublicCareer>(`/api/v1/public/career?lang=${language}`);
  }

  private statusParams(status?: PublicationStatus | null): HttpParams {
    return status ? new HttpParams().set('status', status) : new HttpParams();
  }

  private withCsrf<T>(request: Observable<T>): Observable<T> {
    return this.authApi.csrf().pipe(switchMap(() => request));
  }
}
