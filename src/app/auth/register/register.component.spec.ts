import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const usuarioSpy = jasmine.createSpyObj('UsuarioService', ['register']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        { provide: UsuarioService, useValue: usuarioSpy },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    usuarioServiceSpy = TestBed.inject(
      UsuarioService
    ) as jasmine.SpyObj<UsuarioService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería detectar contraseñas distintas como inválido', () => {
    component.registerForm.setValue({
      name: 'Octavio',
      email: 'test@test.com',
      password: 'Password1!',
      confirmPassword: 'Distinta1!',
      role: 'usuario',
    });

    expect(component.registerForm.valid).toBeFalse();
    expect(component.registerForm.errors).toEqual({ mismatch: true });
  });

  it('no debería llamar al servicio si el formulario es inválido', () => {
    component.registerForm.setValue({
      name: '',
      email: 'malformateado',
      password: '123',
      confirmPassword: '123',
      role: '',
    });

    component.onSubmit();
    expect(usuarioServiceSpy.register).not.toHaveBeenCalled();
  });

  it('debería registrar un usuario correctamente y navegar', fakeAsync(() => {
    const mockResponse = {
      nombre: 'Octavio',
      email: 'test@test.com',
      password: 'Password1!',
      rol: 'usuario',
    };
    usuarioServiceSpy.register.and.returnValue(of(mockResponse));

    component.registerForm.setValue({
      name: 'Octavio',
      email: 'test@test.com',
      password: 'Password1!',
      confirmPassword: 'Password1!',
      role: 'usuario',
    });

    component.onSubmit();

    expect(usuarioServiceSpy.register).toHaveBeenCalled();
    expect(component.success).toContain('Octavio');

    tick(2000); // espera el setTimeout
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('debería manejar error de tipo `message` del backend', () => {
    const errorResponse = {
      error: { message: 'El correo ya está registrado.' },
    };
    usuarioServiceSpy.register.and.returnValue(throwError(() => errorResponse));

    component.registerForm.setValue({
      name: 'Octavio',
      email: 'existente@test.com',
      password: 'Password1!',
      confirmPassword: 'Password1!',
      role: 'usuario',
    });

    component.onSubmit();
    expect(component.error).toBe('El correo ya está registrado.');
  });

  it('debería manejar error tipo `error` del backend', () => {
    const errorResponse = { error: { error: 'Internal Server Error' } };
    usuarioServiceSpy.register.and.returnValue(throwError(() => errorResponse));

    component.registerForm.setValue({
      name: 'Octavio',
      email: 'otro@test.com',
      password: 'Password1!',
      confirmPassword: 'Password1!',
      role: 'usuario',
    });

    component.onSubmit();
    expect(component.error).toBe('Internal Server Error');
  });

  it('debería manejar error inesperado', () => {
    usuarioServiceSpy.register.and.returnValue(throwError(() => ({})));

    component.registerForm.setValue({
      name: 'Octavio',
      email: 'nuevo@test.com',
      password: 'Password1!',
      confirmPassword: 'Password1!',
      role: 'usuario',
    });

    component.onSubmit();
    expect(component.error).toBe('Error inesperado al registrar el usuario.');
  });
});
