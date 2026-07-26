import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

import { AuthSessionService } from '../application/auth-session.service';

export const adminAuthGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthSessionService);
  const router = inject(Router);

  return auth.loadCurrentSession().pipe(
    map((authenticated) =>
      authenticated
        ? true
        : router.createUrlTree(['/admin/login'], {
            queryParams: { reason: 'session-expired', returnUrl: state.url },
          }),
    ),
  );
};
