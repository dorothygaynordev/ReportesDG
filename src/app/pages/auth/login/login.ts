import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RequestLogin } from '@app/core/auth/models/request-login.interface';
import { AuthService } from '@core/auth/services/auth.service';
import { LoginService } from '@pages/auth/login/login.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    ButtonModule,
    InputTextModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    SelectModule,
    MessageModule,
    ReactiveFormsModule,
    NgClass,
    RouterLink,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './login.html',
})
export class Login {
  private formBuilder = inject(FormBuilder);
  private loginService = inject(LoginService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  showPassword = false;
  loading = false;

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  formStatus = toSignal(this.loginForm.statusChanges, {
    initialValue: this.loginForm.status,
  });

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        const request: RequestLogin = {
          email: this.loginForm.value.email ?? '',
          password: this.loginForm.value.password ?? '',
        };

        this.loading = true;
        const data$ = this.loginService.login(request);
        const response = await lastValueFrom(data$);

        this.loading = false;
        if (response.success) {
          await this.authService.saveToken(response.data);
          this.router.navigate(['/reportes']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              response.message ||
              'La contraseña ingresada no existe en el sistema.',
            life: 3000,
          });
        }
      } catch (error) {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error de servidor',
          detail: 'Ocurrió un error inesperado. Intente nuevamente más tarde.',
          life: 3000,
        });
        console.log('Error en recuperacion de contraseña', error);
      }
    }
  }
}
