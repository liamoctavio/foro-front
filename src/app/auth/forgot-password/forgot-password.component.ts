import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  form: FormGroup;
  submitted = false;
  success = '';
  error = '';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.submitted = true;
    this.success = '';
    this.error = '';

    if (this.form.invalid) return;

    const { email } = this.form.value;

    // Simulación: revisar si existe en localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some((u: any) => u.email === email);

    if (!userExists) {
      this.error = 'No se encontró ninguna cuenta con ese correo.';
      return;
    }

    // Simular envío de correo
    this.success =
      'Se ha enviado un enlace para restablecer tu contraseña (simulado)';
    this.form.reset();
    this.submitted = false;
  }
}
