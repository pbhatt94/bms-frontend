import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '../../../services/auth-service/auth.service';

export const UserGuard: CanActivateFn = async (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  try {
    await authService.fetchAndStoreUserDetails();
  } catch (error) {
    console.error('Failed to fetch user details:', error);
    return router.navigate(['/login']).then(() => false);
  }

  if (!authService.isAdmin()) {
    return true;
  } else {
    return router.navigate(['/admin/home']).then(() => false);
  }
};
