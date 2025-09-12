import { NgClass } from '@angular/common';
import {
  Component,
  computed,
  inject,
  Input,
  signal,
  Signal,
} from '@angular/core';
import { ClickOutside } from '@app/core/directives/click-outside';
import { Breadcrum } from '@common/breadcrum/breadcrum';
import { AuthService } from '@core/auth/services/auth.service';
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
    Breadcrum,
    ClickOutside,
    NgClass,
  ],
  templateUrl: './header.html',
})
export class Header {
  @Input() scrolled!: boolean | Signal<boolean>;
  // Services
  public sidebarService = inject(SidebarService);
  public fullscreenService = inject(FullScreenService);
  private authService = inject(AuthService);

  public currentUser = this.authService.currentUser;
  public username = computed(() => this.currentUser()?.email ?? 'Invitado');
  public menuOpen = signal(false);

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
  }

  toggleMenu = () => this.menuOpen.update((open) => !open);
}
