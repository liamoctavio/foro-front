import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

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
    private route: ActivatedRoute
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
    //   this.submitted = true;
    //   if (this.loginForm.invalid) return;

    //   const { email, password } = this.loginForm.value;

    //   if (email === 'admin@foro.com' && password === 'Admin123!') {
    //     alert('¡Login exitoso!');
    //   } else {
    //     this.error = 'Correo o contraseña incorrectos.';
    //   }
    // }

    this.submitted = true;
    this.error = '';

    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const user = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (!user) {
      this.error = 'Correo o contraseña incorrectos.';
      return;
    }

    localStorage.setItem('loggedUser', JSON.stringify(user));

    alert(`¡Bienvenido, ${user.name}!`);

    this.router.navigate(['/home']);
  }
}
