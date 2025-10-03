import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { MenuSidebar } from '@app/shared/services/menu-sidebar';
import { AuthService } from '@core/auth/services/auth.service';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state,
) => {
  const authService = inject(AuthService);
  const menuService = inject(MenuSidebar);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return false;
  }

  const requiredRoles = route.data?.['roles'] as string[];

  // Si no se especifican roles, permitir acceso
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // Verificar si el usuario tiene los roles requeridos
  const hasRequiredRoles = authService.hasAnyRole(requiredRoles);

  if (!hasRequiredRoles) {
    router.navigate(['/access-denied']);
    return false;
  }

  // REDIRECCIÓN PARA RUTAS PADRE VACÍAS
  // Si estamos en una ruta como '/reportes' (sin hijos en la URL)
  if (shouldRedirectToFirstChild(route, state)) {
    const firstAccessibleItem = menuService.getFirstAccessibleItem();

    if (firstAccessibleItem && firstAccessibleItem.path !== state.url) {
      router.navigate([firstAccessibleItem.path]);
      return false;
    } else {
      console.log('⚠️ No se encontró ningún hijo accesible');
    }
  }

  return true;
};

function shouldRedirectToFirstChild(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): boolean {
  const url = state.url;

  // Caso 1: Ruta exacta como '/reportes' (sin slash final)
  if (url === `/${route.routeConfig?.path}`) {
    return true;
  }

  // Caso 2: Ruta con slash final como '/reportes/'
  if (url === `/${route.routeConfig?.path}/`) {
    return true;
  }

  // Caso 3: No hay child routes activas
  if (!route.firstChild) {
    return true;
  }

  return false;
}
