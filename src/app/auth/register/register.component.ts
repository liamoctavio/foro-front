import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, private router: Router) {
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
    const normalizedEmail = email.trim().toLowerCase();

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const userExists = users.some(
      (u: any) => u.email.toLowerCase() === normalizedEmail
    );

    if (userExists) {
      this.error = 'El correo ya está registrado.';
      return;
    }

    users.push({ name, email: normalizedEmail, password, role });
    localStorage.setItem('users', JSON.stringify(users));

    this.success = `Usuario ${name} registrado exitosamente`;

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }
}
