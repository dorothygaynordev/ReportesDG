import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@app/core/services/settings.service';
import { User } from '@shared/models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser = signal<User | null>(null);
  public isLoggedIn = signal<boolean>(false);
  private settings = inject(SettingsService);
  private router = inject(Router);

  constructor() {
    this.loadUserFromToken();
  }

  private get tokenKey() {
    return this.settings.token;
  }

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.loadUserFromToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/auth/login']);
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() < payload.exp * 1000;
    } catch {
      return false;
    }
  }

  private decodeToken(token: string): User | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        name: payload.name,
        email: payload.email,
        userName: payload.nickname,
        rol: payload.rol,
        expiration: payload.exp,
      } as User;
    } catch {
      console.error('Invalid token');
      return null;
    }
  }

  public loadUserFromToken() {
    const token = this.getToken();
    if (!token) {
      this.currentUser.set(null);
      this.isLoggedIn.set(false);
      return;
    }

    const user = this.decodeToken(token);
    if (user) {
      this.currentUser.set(user);
      this.isLoggedIn.set(true);
    } else {
      this.currentUser.set(null);
      this.isLoggedIn.set(false);
    }
  }

  async getUsername() {
    const token = await this.getToken();
    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email ?? null;
    } catch {
      return null;
    }
  }
}
