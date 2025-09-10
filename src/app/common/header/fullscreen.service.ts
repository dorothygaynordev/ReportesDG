import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FullScreenService {
  // Signal para guardar estado
  isFullscreen = signal(false);

  constructor() {
    // Detectar cambios externos (ej: tecla ESC)
    document.addEventListener('fullscreenchange', () => {
      this.isFullscreen.set(!!document.fullscreenElement);
    });
  }

  toggle() {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => this.isFullscreen.set(true))
        .catch(() => this.isFullscreen.set(false));
    } else {
      document
        .exitFullscreen()
        .then(() => this.isFullscreen.set(false))
        .catch(() => this.isFullscreen.set(true));
    }
  }
}
