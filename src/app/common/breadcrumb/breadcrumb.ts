import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MenuSidebar } from '@shared/services/menu-sidebar';
import { BreadcrumbService } from './breadcrumb.service';

@Component({
  selector: 'app-breadcrum',
  imports: [RouterLink],
  templateUrl: './breadcrumb.html',
})
export class Breadcrumb {
  breadcrumbService = inject(BreadcrumbService);
  menuService = inject(MenuSidebar);
  router = inject(Router);

  // Verificar si es una ruta padre
  isParentRoute(url: string): boolean {
    const parentRoutes = ['/reportes', '/gestion', '/admin'];
    return parentRoutes.includes(url);
  }

  // Navegar al primer hijo accesible de una ruta padre
  navigateToFirstAccessibleChild(parentPath: string): void {
    const firstItem = this.menuService.getFirstAccessibleItem();

    if (firstItem && firstItem.path.startsWith(parentPath)) {
      this.router.navigate([firstItem.path]);
    } else {
      // Si no encuentra hijo accesible, navegar al padre (aunque no tenga página)
      this.router.navigate([parentPath]);
    }
  }
}
