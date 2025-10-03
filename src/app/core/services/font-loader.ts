import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FontLoader {
  private http = inject(HttpClient);

  private _fontsLoaded = signal<boolean>(false);
  private _fontsLoading = signal<boolean>(false);
  private _fontsError = signal<string | null>(null);

  readonly fontsLoaded = this._fontsLoaded.asReadonly();
  readonly fontsLoading = this._fontsLoading.asReadonly();
  readonly fontsError = this._fontsError.asReadonly();

  async preloadFonts(): Promise<void> {
    if (this._fontsLoaded()) {
      return;
    }

    this._fontsLoading.set(true);
    this._fontsError.set(null);

    try {
      await this.loadFontsWithFallback();
      this._fontsLoaded.set(true);
      this._fontsLoading.set(false);
    } catch (error) {
      this._fontsError.set(
        error instanceof Error ? error.message : 'Error desconocido',
      );
      this._fontsLoading.set(false);
      console.warn(
        '⚠️ Error cargando fuentes, continuando con fallback',
        error,
      );
    }
  }

  /**
   * Estrategia de carga con múltiples fallbacks
   */
  private async loadFontsWithFallback(): Promise<void> {
    // Método 1: Font Loading API (más moderno)
    if ('fonts' in document) {
      try {
        await this.loadWithFontLoadingAPI();
        return;
      } catch {
        console.warn(
          `Font Loading API falló, intentando método alternativo...`,
        );
      }
    }

    // Método 2: Elementos HTML invisibles (fallback)
    await this.loadWithHiddenElements();
  }

  /**
   * Usa Font Loading API para carga más eficiente
   */
  private async loadWithFontLoadingAPI(): Promise<void> {
    const fontFaces = [
      new FontFace(
        'Material Symbols Outlined',
        'url(/fonts/material-symbols/material-symbols-outlined.woff2) format("woff2")',
        { display: 'swap' },
      ),
      new FontFace(
        'Material Symbols Rounded',
        'url(/fonts/material-symbols/material-symbols-rounded.woff2) format("woff2")',
        { display: 'swap' },
      ),
    ];

    const loadPromises = fontFaces.map((fontFace) => {
      return fontFace.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
        return loadedFont;
      });
    });

    await Promise.all(loadPromises);
  }

  /**
   * Fallback: crea elementos invisibles para forzar la carga
   */
  private loadWithHiddenElements(): Promise<void> {
    return new Promise((resolve) => {
      const preloadContainer = document.createElement('div');
      preloadContainer.style.cssText = `
        position: absolute;
        opacity: 0;
        pointer-events: none;
        left: -9999px;
        top: -9999px;
      `;

      // Iconos críticos que se usarán en la aplicación
      const criticalIcons = [
        'home',
        'settings',
        'person',
        'search',
        'menu',
        'notifications',
        'dashboard',
        'analytics',
        'report',
        'arrow_back',
        'arrow_forward',
        'close',
        'expand_more',
      ];

      criticalIcons.forEach((icon) => {
        const span = document.createElement('span');
        span.className = 'material-symbols-outlined';
        span.textContent = icon;
        span.style.fontSize = '1px'; // Mínimo tamaño para carga eficiente
        preloadContainer.appendChild(span);
      });

      document.body.appendChild(preloadContainer);

      // Timeout de seguridad
      const cleanup = () => {
        setTimeout(() => {
          if (preloadContainer.parentNode) {
            preloadContainer.parentNode.removeChild(preloadContainer);
          }
        }, 5000);
      };

      // Intentar detectar carga con MutationObserver como fallback
      const observer = new MutationObserver(() => {
        let allLoaded = true;
        criticalIcons.forEach((icon, index) => {
          const span = preloadContainer.children[index] as HTMLElement;
          if (span.offsetWidth === 0 && span.offsetHeight === 0) {
            allLoaded = false;
          }
        });

        if (allLoaded) {
          observer.disconnect();
          cleanup();
          resolve();
        }
      });

      observer.observe(preloadContainer, {
        attributes: true,
        attributeFilter: ['style', 'class'],
      });

      // Timeout de respaldo
      setTimeout(() => {
        observer.disconnect();
        cleanup();
        resolve();
      }, 3000);
    });
  }

  /**
   * Verifica el estado actual de las fuentes
   */
  getFontsStatus(): {
    loaded: boolean;
    loading: boolean;
    error: string | null;
  } {
    return {
      loaded: this._fontsLoaded(),
      loading: this._fontsLoading(),
      error: this._fontsError(),
    };
  }

  /**
   * Reinicia el estado (útil para testing)
   */
  reset(): void {
    this._fontsLoaded.set(false);
    this._fontsLoading.set(false);
    this._fontsError.set(null);
  }
}
