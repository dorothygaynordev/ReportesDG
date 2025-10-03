import { NgClass } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '@common/sidebar/sidebar.service';
import { AuthService } from '@core/auth/services/auth.service';
import { MenuSidebar } from '@shared/services/menu-sidebar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-sidebar',
  imports: [
    NgScrollbarModule,
    RouterLinkActive,
    RouterLink,
    ButtonModule,
    NgClass,
  ],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  sidebarService = inject(SidebarService);
  private authService = inject(AuthService);
  menuService = inject(MenuSidebar);

  menuItems = computed(() => this.menuService.accessibleMenuItems());

  userInfo = computed(() => {
    const user = this.authService.currentUser();
    const roles = this.authService.getRoleNames().join(', ');

    return user
      ? {
          name: user.name,
          roles: roles,
        }
      : null;
  });

  hasAccess = computed(() => this.menuItems().length > 0);
}
