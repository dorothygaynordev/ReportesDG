import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private readonly visible = signal(true);
  private readonly mobile = signal(window.innerWidth < 768);

  public sidebarVisible = computed(() => this.visible());
  public isMobile = computed(() => this.mobile());

  constructor() {
    window.addEventListener('resize', () => {
      const mobile = window.innerWidth < 768;
      this.mobile.set(mobile);

      if (!mobile) {
        this.visible.set(true);
      } else {
        this.visible.set(false);
      }
    });
  }

  toggleSidebar() {
    this.visible.update((view) => !view);
  }

  closeSidebar() {
    this.visible.set(false);
  }
}
