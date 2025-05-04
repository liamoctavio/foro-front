import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.route.queryParams.subscribe((params) => {
      if (params['msg'] === 'not-authenticated') {
        this.error = 'Debes iniciar sesión para acceder a esta página.';
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    console.log('Formulario enviado');

    if (this.loginForm.invalid) {
      console.log('Formulario inválido');
      return;
    }
    const { email, password } = this.loginForm.value;

    this.usuarioService.login(email, password).subscribe({
      next: (usuario) => {
        console.log('Login exitoso:', usuario);

        localStorage.setItem('loggedUser', JSON.stringify(usuario));
        const authHeader = 'Basic ' + btoa(`${email}:${password}`);
        localStorage.setItem('authHeader', authHeader);

        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.error = 'Correo o contraseña incorrectos.';
        console.error('Error en login:', err);
      },
    });
  }
}
