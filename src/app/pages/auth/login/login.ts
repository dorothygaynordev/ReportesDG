import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestLogin } from '@app/core/auth/models/request-login.interface';
import { AuthService } from '@core/auth/services/auth.service';
import { LoginService } from '@pages/auth/login/login.service';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
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
  ],
  templateUrl: './login.html',
})
export class Login {
  private formBuilder = inject(FormBuilder);
  private loginService = inject(LoginService);
  private authService = inject(AuthService);
  private router = inject(Router);
  public showPassword = false;

  loginForm = this.formBuilder.group({
    email: this.formBuilder.control('', {
      validators: [Validators.required, Validators.email],
    }),
    password: this.formBuilder.control('', {
      validators: [Validators.required],
    }),
  });

  formStatus = toSignal(this.loginForm.statusChanges, {
    initialValue: this.loginForm.status,
  });

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const request: RequestLogin = {
        email: this.loginForm.value.email ?? '',
        password: this.loginForm.value.password ?? '',
      };

      const data$ = this.loginService.login(request);
      const response = await lastValueFrom(data$);

      if (response.success) {
        await this.authService.saveToken(response.data);
        this.router.navigate(['/reportes']);
      }
    }
  }
}
