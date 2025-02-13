import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userAuthService = inject(UserAuthService);
  const router = inject(Router);
  const userService = inject(UserService);

  if (userAuthService.getToken() != null) {
    const roles = route.data["roles"] ?? []; 

    if (roles.length > 0) {
      const match = userService.roleMatch(roles);
      if (match) {
        return true;
      } else {
        return router.createUrlTree(['/forbidden']); 
      }
    }
    return true;
  }

  return router.createUrlTree(['/login']); 
};
