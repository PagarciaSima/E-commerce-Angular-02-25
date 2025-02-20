import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userAuthService = inject(UserAuthService);
  const router = inject(Router);
  const userService = inject(UserService);

  const roles = route.data["roles"] ?? [];

  // Si la ruta no define roles, cualquier usuario autenticado puede acceder
  if (roles.length === 0) {
    return true;
  }
  
  if (!userAuthService.getToken()) {
    return router.createUrlTree(['/login']);
  }

  // Verificamos si el usuario tiene alguno de los roles requeridos
  const match = userService.roleMatch(roles);
  return match ? true : router.createUrlTree(['/forbidden']);
};
