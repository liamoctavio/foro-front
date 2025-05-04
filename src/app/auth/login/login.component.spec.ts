import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { UsuarioService } from '../../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const usuarioSpy = jasmine.createSpyObj('UsuarioService', ['login']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: UsuarioService, useValue: usuarioSpy },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ msg: 'not-authenticated' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
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

  it('debería inicializar el formulario con validadores', () => {
    const form = component.loginForm;
    expect(form).toBeDefined();
    expect(form.controls['email'].valid).toBeFalse();
    expect(form.controls['password'].valid).toBeFalse();
  });

  it('debería mostrar mensaje de no autenticado si viene en queryParams', () => {
    expect(component.error).toBe(
      'Debes iniciar sesión para acceder a esta página.'
    );
  });

  it('no debería llamar al servicio si el formulario es inválido', () => {
    component.loginForm.setValue({ email: '', password: '' });
    component.onSubmit();
    expect(usuarioServiceSpy.login).not.toHaveBeenCalled();
  });

  it('debería llamar al servicio y navegar en login exitoso', () => {
    const userMock = { id: 1, nombre: 'Octavio' };
    usuarioServiceSpy.login.and.returnValue(of(userMock));

    component.loginForm.setValue({
      email: 'test@test.com',
      password: '123456',
    });
    component.onSubmit();

    expect(usuarioServiceSpy.login).toHaveBeenCalledWith(
      'test@test.com',
      '123456'
    );
    expect(localStorage.getItem('loggedUser')).toContain('Octavio');
    expect(localStorage.getItem('authHeader')).toContain('Basic');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('debería manejar errores de login', () => {
    usuarioServiceSpy.login.and.returnValue(
      throwError(() => new Error('Credenciales inválidas'))
    );
    component.loginForm.setValue({
      email: 'fail@test.com',
      password: '123456',
    });

    component.onSubmit();

    expect(component.error).toBe('Correo o contraseña incorrectos.');
  });

  // beforeEach(async () => {
  //   await TestBed.configureTestingModule({
  //     imports: [LoginComponent]
  //   })
  //   .compileComponents();

  //   fixture = TestBed.createComponent(LoginComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
