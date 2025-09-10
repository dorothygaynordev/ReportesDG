import {
  Component,
  computed,
  EventEmitter,
  inject,
  Output,
  signal,
} from '@angular/core';
import { AuthService } from '@core/auth/services/auth.service';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MenuModule } from 'primeng/menu';
import { PopoverModule } from 'primeng/popover';
import { StyleClassModule } from 'primeng/styleclass';
import { SidebarService } from '../sidebar/sidebar.service';
import { FullScreenService } from './fullscreen.service';

@Component({
  selector: 'app-header',
  imports: [
    ButtonModule,
    PopoverModule,
    InputGroupModule,
    InputGroupAddonModule,
    StyleClassModule,
    MenuModule,
  ],
  templateUrl: './header.html',
})
export class Header {
  @Output() toggleSidebar = new EventEmitter<void>();
  public sidebarService = inject(SidebarService);
  public fullScreenService = inject(FullScreenService);
  private authService = inject(AuthService);
  public currentUser = this.authService.currentUser;
  public username = computed(() => this.currentUser()?.userName ?? 'Invitado');
  items = signal<MenuItem[]>([]);

  constructor() {
    this.items.set([
      {
        label: 'Opciones',
        items: [
          {
            label: 'Cerrar sesión',
            icon: 'pi pi-power-off',
            command: () => {
              this.logout();
            },
          },
        ],
      },
    ]);
  }

  logout() {
    this.authService.logout();
  }
}
