import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { lastValueFrom } from 'rxjs';
import { RecoveryPassword } from './recovery-password';

@Component({
  selector: 'app-recovery',
  imports: [
    InputTextModule,
    InputIconModule,
    IconField,
    ButtonModule,
    ReactiveFormsModule,
    RouterLink,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './recovery.html',
})
export class Recovery {
  private formBuilder = inject(FormBuilder);
  private recoveryService = inject(RecoveryPassword);
  private messageService = inject(MessageService);
  private router = inject(Router);

  recoveryForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  async onSubmit() {
    if (this.recoveryForm.valid) {
      try {
        const recovery$ = this.recoveryService.recoveryPassword(
          this.recoveryForm.value.email ?? '',
        );
        const response = await lastValueFrom(recovery$);

        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail:
              response.message || 'Se ha enviado un correo con la contraseña.',
            life: 2000,
          });

          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              response.message ||
              'La contraseña ingresada no existe en el sistema.',
            life: 2000,
          });
        }
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error de servidor',
          detail: 'Ocurrió un error inesperado. Intente nuevamente más tarde.',
          life: 2000,
        });
        console.log('Error en recuperacion de contraseña', error);
      }
    }
  }
}
