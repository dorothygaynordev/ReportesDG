import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@app/core/services/settings.service';
import { RoleConstants } from '@app/shared/constants/roles';
import { User } from '@shared/models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser = signal<User | null>(null);
  public isLoggedIn = signal<boolean>(false);
  private userRoleIds = signal<string[]>([]);

  private settings = inject(SettingsService);
  private router = inject(Router);

  constructor() {
    this.loadUserFromToken();
  }

  // Computed signals para verificación de roles
  public readonly roleIds = computed(() => this.userRoleIds());

  // Computed signals para roles específicos
  public readonly isAdmin = computed(() => this.hasRole(RoleConstants.Admin));
  public readonly isReportes = computed(() =>
    this.hasRole(RoleConstants.Reportes),
  );
  public readonly isFaltas = computed(() => this.hasRole(RoleConstants.Faltas));

  public readonly canSupervise = computed(() =>
    this.hasAnyRole([
      RoleConstants.Admin,
      RoleConstants.Reportes,
      RoleConstants.Faltas,
    ]),
  );

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
    this.userRoleIds.set([]);
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

  private decodeToken(token: string): { user: User | null; roleIds: string[] } {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      const user: User = {
        name: payload.name,
        email: payload.email,
        userName: payload.nickname,
        rol: payload.rol,
        expiration: payload.exp,
      };

      // Extraer roles del token - como strings
      const roleIds: string[] = [];

      // Diferentes formas en que pueden venir los roles en el token
      if (payload.role) {
        // Si viene como string individual
        roleIds.push(payload.role.toString());
      } else if (payload.roles && Array.isArray(payload.roles)) {
        roleIds.push(...payload.roles.map((role: string) => role.toString()));
      } else if (
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      ) {
        // Claim estándar de .NET
        const roles =
          payload[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          ];
        if (Array.isArray(roles)) {
          roleIds.push(...roles.map((role: string) => role.toString()));
        } else {
          roleIds.push(roles.toString());
        }
      } else if (payload.role_id) {
        // Si viene como role_id
        roleIds.push(payload.role_id.toString());
      } else if (payload.roleIds && Array.isArray(payload.roleIds)) {
        // Si viene como roleIds array
        roleIds.push(...payload.roleIds.map((id: string) => id.toString()));
      }

      console.log('Roles extraídos del token:', roleIds); // Para debugging

      return { user, roleIds };
    } catch (error) {
      console.error('Invalid token:', error);
      return { user: null, roleIds: [] };
    }
  }

  public loadUserFromToken() {
    const token = this.getToken();
    if (!token) {
      this.clearAuthState();
      return;
    }

    const { user, roleIds } = this.decodeToken(token);
    if (user) {
      this.currentUser.set(user);
      this.isLoggedIn.set(true);
      this.userRoleIds.set(roleIds);
      console.log('Usuario cargado con roles:', roleIds); // Para debugging
    } else {
      this.clearAuthState();
    }
  }

  private clearAuthState() {
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.userRoleIds.set([]);
  }

  // Métodos para verificación de roles (ahora con strings)
  hasRole(roleId: string | string[]): boolean {
    const roleIds = this.userRoleIds();
    if (!roleIds.length) return false;

    if (Array.isArray(roleId)) {
      return roleId.some((id) => roleIds.includes(id));
    }

    return roleIds.includes(roleId);
  }

  hasAnyRole(roleIds: string[]): boolean {
    return roleIds.some((roleId) => this.hasRole(roleId));
  }

  // Obtener nombres de roles (para display)
  getRoleNames(): string[] {
    const roleIds = this.userRoleIds();
    const roleNames: string[] = [];

    roleIds.forEach((roleId) => {
      switch (roleId) {
        case RoleConstants.Admin:
          roleNames.push('Administrador');
          break;
        case RoleConstants.Reportes:
          roleNames.push('Reportes');
          break;
        case RoleConstants.Faltas:
          roleNames.push('Faltas');
          break;
        default:
          roleNames.push(`Rol ${roleId}`);
      }
    });

    return roleNames;
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

  // Método para debugging - ver contenido del token
  debugToken() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Contenido completo del token:', payload);
      return payload;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
