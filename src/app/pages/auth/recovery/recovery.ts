import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-recovery',
  imports: [
    InputTextModule,
    InputIconModule,
    IconField,
    ButtonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './recovery.html',
})
export class Recovery {
  private formBuilder = inject(FormBuilder);

  recoveryForm = this.formBuilder.group({
    email: this.formBuilder.control('', {
      validators: [Validators.required, Validators.email],
    }),
  });

  fomrStatus = toSignal(this.recoveryForm.statusChanges, {
    initialValue: this.recoveryForm.status,
  });

  async onSubmit() {
    if (this.recoveryForm.valid) {
      console.log(this.recoveryForm.value);
    }
  }
}
