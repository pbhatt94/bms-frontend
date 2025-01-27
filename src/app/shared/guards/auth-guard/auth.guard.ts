import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { Role } from '../../../models/models';
import { AuthService } from '../../../services/auth-service/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if (authService.role$() === Role.admin) {
    return true;
  } else {
    return router.navigate(['Home']).then(() => false);
  }
};
