import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

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

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('loggedUser');
    const user = stored ? JSON.parse(stored) : null;

    this.profileForm = this.fb.group({
      nombre: [user?.nombre || '', [Validators.required]],
      password: ['', [Validators.minLength(6)]],
    });
  }

  onSubmit() {
    this.submitted = true;
    this.success = '';
    this.error = '';

    if (this.profileForm.invalid) return;

    const form = this.profileForm.value;
    const data: any = {};

    if (form.nombre && form.nombre.trim() !== '') {
      data.nombre = form.nombre;
    }

    if (form.password && form.password.trim() !== '') {
      data.password = form.password;
    }

    this.usuarioService.actualizarPerfil(data).subscribe({
      next: (updatedUser) => {
        const actual = JSON.parse(localStorage.getItem('loggedUser')!);
        const nuevo = { ...actual, ...data };
        localStorage.setItem('loggedUser', JSON.stringify(nuevo));

        this.profileForm.patchValue({ nombre: nuevo.nombre });
        this.profileForm.get('password')!.reset();

        this.success = 'Perfil actualizado correctamente.';
        this.submitted = false;
      },
      error: (err) => {
        this.error = 'Hubo un error al actualizar el perfil.';
        console.error('Error al actualizar:', err);
      },
    });
  }
}
