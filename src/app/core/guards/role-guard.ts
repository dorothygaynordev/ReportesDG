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

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
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
  if (shouldRedirectToFirstChild(route, state)) {
    const firstAccessibleItem = menuService.getFirstAccessibleItem();

    if (firstAccessibleItem) {
      // ✅ MEJORA: Evita redirección infinita verificando si ya estamos en la ruta
      if (
        firstAccessibleItem.path !== state.url &&
        !state.url.startsWith(firstAccessibleItem.path + '/')
      ) {
        router.navigate([firstAccessibleItem.path]);
        return false;
      }
    } else {
      router.navigate(['/access-denied']);
      return false;
    }
  }

  return true;
};

function shouldRedirectToFirstChild(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): boolean {
  const url = state.url;
  const routePath = route.routeConfig?.path;

  if (!routePath) return false;

  // Normaliza las rutas removiendo slashes finales
  const normalizedUrl = url.replace(/\/$/, '');
  const normalizedPath = `/${routePath}`.replace(/\/$/, '');

  // Verifica si estamos en la ruta padre sin hijos
  if (normalizedUrl === normalizedPath && !route.firstChild) {
    return true;
  }

  return false;
}
