import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { AuthApiService } from '../../auth/api/auth-api.service';
import { AdminProfile, AdminSiteSettings, PublicPortfolio } from '../models/dto/profile.dto';

@Injectable({ providedIn: 'root' })
export class ProfileApiService {
  private readonly http = inject(HttpClient);
  private readonly authApi = inject(AuthApiService);

  getProfile(): Observable<AdminProfile> {
    return this.http.get<AdminProfile>('/api/v1/admin/profile', { withCredentials: true });
  }

  saveProfile(profile: AdminProfile): Observable<AdminProfile> {
    return this.withCsrf(
      this.http.put<AdminProfile>('/api/v1/admin/profile', profile, { withCredentials: true }),
    );
  }

  uploadProfilePhoto(file: File, altText: string): Observable<AdminProfile> {
    const form = new FormData();
    form.append('file', file);
    if (altText.trim()) {
      form.append('altText', altText.trim());
    }
    return this.withCsrf(
      this.http.post<AdminProfile>('/api/v1/admin/profile/photo', form, { withCredentials: true }),
    );
  }

  deleteProfilePhoto(): Observable<AdminProfile> {
    return this.withCsrf(
      this.http.delete<AdminProfile>('/api/v1/admin/profile/photo', { withCredentials: true }),
    );
  }

  uploadCv(file: File): Observable<AdminProfile> {
    const form = new FormData();
    form.append('file', file);
    return this.withCsrf(
      this.http.post<AdminProfile>('/api/v1/admin/profile/cv', form, { withCredentials: true }),
    );
  }

  deleteCv(): Observable<AdminProfile> {
    return this.withCsrf(
      this.http.delete<AdminProfile>('/api/v1/admin/profile/cv', { withCredentials: true }),
    );
  }

  getSettings(): Observable<AdminSiteSettings> {
    return this.http.get<AdminSiteSettings>('/api/v1/admin/settings', { withCredentials: true });
  }

  saveSettings(settings: AdminSiteSettings): Observable<AdminSiteSettings> {
    return this.withCsrf(
      this.http.put<AdminSiteSettings>('/api/v1/admin/settings', settings, {
        withCredentials: true,
      }),
    );
  }

  uploadLogo(file: File, altText: string): Observable<AdminSiteSettings> {
    const form = new FormData();
    form.append('file', file);
    if (altText.trim()) {
      form.append('altText', altText.trim());
    }
    return this.withCsrf(
      this.http.post<AdminSiteSettings>('/api/v1/admin/settings/logo', form, {
        withCredentials: true,
      }),
    );
  }

  deleteLogo(): Observable<AdminSiteSettings> {
    return this.withCsrf(
      this.http.delete<AdminSiteSettings>('/api/v1/admin/settings/logo', {
        withCredentials: true,
      }),
    );
  }

  uploadFavicon(file: File): Observable<AdminSiteSettings> {
    const form = new FormData();
    form.append('file', file);
    return this.withCsrf(
      this.http.post<AdminSiteSettings>('/api/v1/admin/settings/favicon', form, {
        withCredentials: true,
      }),
    );
  }

  deleteFavicon(): Observable<AdminSiteSettings> {
    return this.withCsrf(
      this.http.delete<AdminSiteSettings>('/api/v1/admin/settings/favicon', {
        withCredentials: true,
      }),
    );
  }

  publicPortfolio(language: 'fr' | 'en'): Observable<PublicPortfolio> {
    return this.http.get<PublicPortfolio>(`/api/v1/public/portfolio?lang=${language}`);
  }

  private withCsrf<T>(request: Observable<T>): Observable<T> {
    return this.authApi.csrf().pipe(switchMap(() => request));
  }
}
