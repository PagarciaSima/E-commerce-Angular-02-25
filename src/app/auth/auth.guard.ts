import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userAuthService = inject(UserAuthService);
  const router = inject(Router);
  const userService = inject(UserService);

  if (!userAuthService.getToken()) {
    return router.createUrlTree(['/login']); 
  }
else {
    const roles = route.data["roles"] ?? []; 

    if (roles.length === 0)
      return router.createUrlTree(['/forbidden']); 
    else {
      const match = userService.roleMatch(roles);
      if (match) {
        return true;
      } 
        return router.createUrlTree(['/forbidden']); 
      
    }
  }

};
