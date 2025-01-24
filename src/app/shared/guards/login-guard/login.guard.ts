import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../../services/auth-service/auth.service';

export const LoginGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);

  if (authService.hasValidToken()) {
    return true;
  } else {
    authService.loggedIn$.set(false);
    authService.user$.set(null);

    return router.navigate(['Login']).then(() => false);
  }
};
