import { TestBed } from '@angular/core/testing';

import { UsuarioService } from './usuario.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.setItem('authHeader', 'Basic test-auth');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuarioService],
    });

    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('debería hacer login con headers codificados', () => {
    const email = 'test@email.com';
    const password = 'secret';
    const encoded = 'Basic ' + btoa(`${email}:${password}`);
    const mockResponse = { nombre: 'Test User', email };

    service.login(email, password).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/usuarios/me');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(encoded);
    req.flush(mockResponse);
  });

  it('debería registrar un usuario', () => {
    const nuevoUsuario = {
      nombre: 'Octavio',
      email: 'octavio@test.com',
      password: 'Password1!',
      rol: 'USUARIO',
    };

    service.register(nuevoUsuario).subscribe((res) => {
      expect(res).toEqual(nuevoUsuario);
    });

    const req = httpMock.expectOne(
      'http://localhost:8080/api/usuarios/registro'
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevoUsuario);
    req.flush(nuevoUsuario);
  });

  it('debería actualizar el perfil con header de autorización', () => {
    const datosActualizados = { nombre: 'Nuevo Nombre' };

    service.actualizarPerfil(datosActualizados).subscribe((res) => {
      expect(res).toEqual(datosActualizados);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/usuarios/me');
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe('Basic test-auth');
    expect(req.request.body).toEqual(datosActualizados);
    req.flush(datosActualizados);
  });
});
