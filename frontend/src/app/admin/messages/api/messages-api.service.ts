import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { AuthApiService } from '../../auth/api/auth-api.service';
import { PageResponse } from '../../../shared/models/page-response.model';
import {
  ContactMessageDetail,
  ContactMessageStatus,
  ContactMessageSummary,
  ContactMetadata,
} from '../models/dto/message.dto';

@Injectable({ providedIn: 'root' })
export class MessagesApiService {
  private readonly http = inject(HttpClient);
  private readonly authApi = inject(AuthApiService);
  private readonly baseUrl = '/api/v1/admin/messages';

  metadata(): Observable<ContactMetadata> {
    return this.http.get<ContactMetadata>(`${this.baseUrl}/metadata`, { withCredentials: true });
  }

  list(
    status?: ContactMessageStatus | null,
    page?: number,
    size?: number,
  ): Observable<PageResponse<ContactMessageSummary>> {
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
    return this.http.get<PageResponse<ContactMessageSummary>>(this.baseUrl, {
      params,
      withCredentials: true,
    });
  }

  detail(id: string): Observable<ContactMessageDetail> {
    return this.http.get<ContactMessageDetail>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  updateStatus(id: string, status: ContactMessageStatus): Observable<ContactMessageDetail> {
    return this.withCsrf(
      this.http.put<ContactMessageDetail>(
        `${this.baseUrl}/${id}/status`,
        { status },
        { withCredentials: true },
      ),
    );
  }

  private withCsrf<T>(request: Observable<T>): Observable<T> {
    return this.authApi.csrf().pipe(switchMap(() => request));
  }
}
