import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  submitted = false;
  success = '';
  error = '';
  user: any = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('loggedUser');
    if (!userData) {
      this.error = 'No hay sesión activa.';
      return;
    }

    this.user = JSON.parse(userData);
    this.profileForm = this.fb.group(
      {
        name: [this.user.name, Validators.required],
        password: [
          '',
          [
            Validators.minLength(8),
            Validators.maxLength(16),
            Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/),
          ],
        ],
        confirmPassword: [''],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const pass = form.get('password')!.value;
    const confirm = form.get('confirmPassword')!.value;
    return pass && confirm && pass !== confirm ? { mismatch: true } : null;
  }

  onSubmit() {
    this.submitted = true;
    this.success = '';
    this.error = '';

    if (this.profileForm.invalid) return;

    const { name, password } = this.profileForm.value;

    // Obtener usuarios del localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Buscar al usuario actual
    const index = users.findIndex((u: any) => u.email === this.user.email);
    if (index === -1) {
      this.error = 'Usuario no encontrado.';
      return;
    }

    users[index].name = name;
    if (password) {
      users[index].password = password;
    }

    // Actualizar usuario en localStorage
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedUser', JSON.stringify(users[index]));

    this.success = 'Perfil actualizado exitosamente';
    this.profileForm.reset();
    this.submitted = false;
  }
}
