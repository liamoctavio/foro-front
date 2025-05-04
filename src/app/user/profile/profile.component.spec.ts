import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { UsuarioService } from '../../services/usuario.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;

  const mockUser = {
    nombre: 'Octavio',
    email: 'octavio@test.com',
    rol: 'USUARIO',
  };

  beforeEach(async () => {
    localStorage.setItem('loggedUser', JSON.stringify(mockUser));

    const usuarioSpy = jasmine.createSpyObj('UsuarioService', [
      'actualizarPerfil',
    ]);

    await TestBed.configureTestingModule({
      imports: [ProfileComponent, ReactiveFormsModule],
      providers: [{ provide: UsuarioService, useValue: usuarioSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    usuarioServiceSpy = TestBed.inject(
      UsuarioService
    ) as jasmine.SpyObj<UsuarioService>;

    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con el nombre del usuario', () => {
    expect(component.profileForm.get('nombre')?.value).toBe(mockUser.nombre);
  });

  it('no debería enviar el formulario si es inválido', () => {
    component.profileForm.get('nombre')?.setValue('');
    component.onSubmit();

    expect(usuarioServiceSpy.actualizarPerfil).not.toHaveBeenCalled();
  });

  it('debería actualizar perfil correctamente si el formulario es válido', () => {
    const nuevoNombre = 'Nuevo Nombre';
    usuarioServiceSpy.actualizarPerfil.and.returnValue(of({}));

    component.profileForm.setValue({
      nombre: nuevoNombre,
      password: 'nuevaClave',
    });

    component.onSubmit();

    const updatedUser = JSON.parse(localStorage.getItem('loggedUser')!);
    expect(updatedUser.nombre).toBe(nuevoNombre);
    expect(component.success).toBe('Perfil actualizado correctamente.');
    expect(component.profileForm.get('password')?.value).toBeNull();
  });

  it('debería manejar error al actualizar el perfil', () => {
    spyOn(console, 'error');
    usuarioServiceSpy.actualizarPerfil.and.returnValue(
      throwError(() => new Error('Fallo actualización'))
    );

    component.profileForm.setValue({
      nombre: 'Nuevo Nombre',
      password: '123456',
    });

    component.onSubmit();

    expect(component.error).toBe('Hubo un error al actualizar el perfil.');
    expect(console.error).toHaveBeenCalledWith(
      'Error al actualizar:',
      jasmine.any(Error)
    );
  });
});
