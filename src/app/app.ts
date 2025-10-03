import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <span
      class="material-symbols-outlined force-font-load"
      style="display: none"
      >home</span
    >
    <router-outlet></router-outlet>
  `,
})
export class App {
  private authService = inject(AuthService);

  constructor() {
    this.authService.isLoggedIn.set(true);
  }
}
