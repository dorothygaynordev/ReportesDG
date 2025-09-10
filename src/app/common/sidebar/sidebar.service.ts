import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private readonly _visible = signal(true); // en escritorio por defecto visible
  private readonly _mobile = signal(window.innerWidth < 1024);

  public sidebarVisible = computed(() => this._visible());
  public isMobile = computed(() => this._mobile());

  constructor() {
    window.addEventListener('resize', () => {
      const mobile = window.innerWidth < 1024;
      this._mobile.set(mobile);

      // si cambia a escritorio, sidebar siempre visible
      if (!mobile) {
        this._visible.set(true);
      } else {
        this._visible.set(false);
      }
    });
  }

  toggleSidebar() {
    this._visible.update((v) => !v);
  }

  closeSidebar() {
    this._visible.set(false);
  }
}
