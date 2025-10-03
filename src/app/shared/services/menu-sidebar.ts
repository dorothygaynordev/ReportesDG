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
    return this.menuItems.filter((item) =>
      this.authService.hasAnyRole(item.roles),
    );
  });

  getFirstAccessibleItem(): MenuItem | null {
    const items = this.accessibleMenuItems();
    return items.length > 0 ? items[0] : null;
  }
}
