import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(16),
            Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/), // al menos 1 mayúscula, minúscula, número y símbolo
          ],
        ],
        confirmPassword: ['', Validators.required],
        role: ['usuario', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')!.value === form.get('confirmPassword')!.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    this.submitted = true;
    this.success = '';
    this.error = '';

    if (this.registerForm.invalid) return;

    const { name, email, password, role } = this.registerForm.value;
    const nuevoUsuario = {
      nombre: name,
      email: email.trim().toLowerCase(),
      password,
      rol: role.toUpperCase(),
    };

    this.usuarioService.register(nuevoUsuario).subscribe({
      next: (res) => {
        this.success = `Usuario ${res.nombre} registrado exitosamente`;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        console.error(err);
        console.log('Detalle del error:', err.error);
        if (err.error?.message) {
          this.error = err.error.message;
        } else if (err.error?.error) {
          this.error = err.error.error;
        } else {
          this.error = 'Error inesperado al registrar el usuario.';
        }
      },
    });
  }
}
