import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';
import { UserService } from '../services/user.service';

/**
 * Authorization guard that restricts access to routes based on user authentication and roles.
 * 
 * - If the route does not specify required roles, any authenticated user can access it.
 * - If the user is not authenticated, they are redirected to the login page.
 * - If the user lacks the required roles, they are redirected to the forbidden page.
 * 
 * @param route The activated route snapshot containing route metadata.
 * @param state The current router state snapshot.
 * @returns `true` if access is allowed, otherwise a `UrlTree` redirecting to `/login` or `/forbidden`.
 */
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
