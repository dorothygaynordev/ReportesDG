import { computed, inject, Injectable } from '@angular/core';
import { AuthService } from '@core/auth/services/auth.service';
import { RoleConstants } from '../constants/roles';
import { MenuItem } from '../models/menu-item';

@Injectable({
  providedIn: 'root',
})
export class MenuSidebar {
  private authService = inject(AuthService);

  private menuItems: MenuItem[] = [
    {
      path: '/reportes/ventas-cfe',
      label: 'Ventas CFE',
      icon: 'shopping_bag',
      iconClass: 'material-symbols-rounded',
      roles: [RoleConstants.Admin, RoleConstants.Reportes],
    },
    {
      path: '/reportes/faltas',
      label: 'Faltas Recurrentes',
      icon: 'assignment_late',
      iconClass: 'material-symbols-rounded',
      roles: [RoleConstants.Admin, RoleConstants.Faltas],
    },
  ];

  accessibleMenuItems = computed(() => {
    if (!this.authService.isAuthenticated()) {
      return [];
    }

    return this.menuItems.filter((item) =>
      this.authService.hasAnyRole(item.roles),
    );
  });

  getFirstAccessibleItem(): MenuItem | null {
    if (!this.authService.isAuthenticated()) {
      return null;
    }

    const items = this.accessibleMenuItems();

    if (items.length === 0) {
      return null;
    }

    return items[0];
  }

  hasAccessToPath(path: string): boolean {
    if (!this.authService.isAuthenticated()) {
      return false;
    }

    const item = this.menuItems.find((i) => i.path === path);
    if (!item) return false;

    return this.authService.hasAnyRole(item.roles);
  }

  getAccessiblePaths(): string[] {
    return this.accessibleMenuItems().map((item) => item.path);
  }

  isValidMenuPath(path: string): boolean {
    return this.menuItems.some((item) => item.path === path);
  }
}
