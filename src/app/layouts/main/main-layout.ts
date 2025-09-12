import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '@common/header/header';
import { Sidebar } from '@common/sidebar/sidebar';
import { SidebarService } from '@common/sidebar/sidebar.service';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet, Header, Sidebar],
  templateUrl: './main-layout.html',
})
export class MainLayout {
  public sidebarService = inject(SidebarService);
  public scrolled = signal(false);

  constructor() {
    effect(() => {
      const onScroll = () => this.scrolled.set(window.scrollY > 0);
      window.addEventListener('scroll', onScroll);
      return () => window.removeEventListener('scroll', onScroll);
    });
  }
}
