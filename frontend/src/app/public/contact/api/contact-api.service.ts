import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { ContactFormPayload } from '../models/contact.model';

interface ContactCsrfTokenResponse {
  readonly headerName: string;
  readonly parameterName: string;
  readonly token: string;
}

@Injectable({ providedIn: 'root' })
export class ContactApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/public/contact';

  submit(payload: ContactFormPayload): Observable<void> {
    return this.csrf().pipe(
      switchMap(() => this.http.post<void>(this.baseUrl, payload, { withCredentials: true })),
    );
  }

  private csrf(): Observable<ContactCsrfTokenResponse> {
    return this.http.get<ContactCsrfTokenResponse>(`${this.baseUrl}/csrf`, { withCredentials: true });
  }
}
