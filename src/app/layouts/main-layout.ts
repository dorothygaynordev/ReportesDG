import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '@common/header/header';
import { Sidebar } from '@common/sidebar/sidebar';
import { SidebarService } from '@common/sidebar/sidebar.service';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet, Header, Sidebar],
  template: `
    <app-header (toggleSidebar)="sidebarService.toggleSidebar()"></app-header>
    <app-sidebar></app-sidebar>

    <main
      class="transition-all duration-300 pt-14"
      [class.lg:ml-64]="
        sidebarService.sidebarVisible() && !sidebarService.isMobile()
      "
    >
      <div class="p-6">
        <router-outlet></router-outlet>
      </div>
    </main>
  `,
})
export class MainLayout {
  public sidebarService = inject(SidebarService);
}
