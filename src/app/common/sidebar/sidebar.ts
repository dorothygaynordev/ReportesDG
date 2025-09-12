import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ButtonModule } from 'primeng/button';
import { SidebarService } from './sidebar.service';

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
  public sidebarService = inject(SidebarService);
}
