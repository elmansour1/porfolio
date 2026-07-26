import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { Observable, of } from 'rxjs';

import { adminAuthGuard } from './admin-auth.guard';
import { AuthSessionService } from '../application/auth-session.service';

describe('adminAuthGuard', () => {
  it('keeps the requested admin route when redirecting to login', (done) => {
    const auth = {
      loadCurrentSession: () => of(false),
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: AuthSessionService, useValue: auth },
      ],
    });

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/admin/dashboard' } as RouterStateSnapshot;

    TestBed.runInInjectionContext(() => {
      const result = adminAuthGuard(route, state);
      if (typeof result === 'boolean') {
        fail('Guard should return an UrlTree observable for unauthenticated sessions.');
        done();
        return;
      }

      (result as Observable<UrlTree>).subscribe((guardResult) => {
        expect(guardResult.toString()).toContain('/admin/login');
        expect(guardResult.toString()).toContain('returnUrl=%2Fadmin%2Fdashboard');
        done();
      });
    });
  });
});
