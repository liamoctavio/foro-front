import { TestBed } from '@angular/core/testing';

import { ThreadService } from './thread.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Thread } from '../models/thread.model';

describe('ThreadService', () => {
  let service: ThreadService;
  let httpMock: HttpTestingController;

  const mockThreads: Thread[] = [
    {
      id: 1,
      titulo: 'Tema 1',
      contenido: 'Contenido 1',
      usuario: {
        id: 1,
        nombre: 'Usuario 1',
        email: 'usuario1@example.com',
        rol: 'admin',
      },
      categoria: { id: 1, nombre: 'Categoria 1' },
    },
    {
      id: 2,
      titulo: 'Tema 2',
      contenido: 'Contenido 2',
      usuario: {
        id: 2,
        nombre: 'Usuario 2',
        email: 'usuario2@example.com',
        rol: 'user',
      },
      categoria: { id: 2, nombre: 'Categoria 2' },
    },
  ];

  const authHeader = 'Basic test-auth';

  beforeEach(() => {
    localStorage.setItem('authHeader', authHeader);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ThreadService],
    });

    service = TestBed.inject(ThreadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('debería obtener los temas por categoría', () => {
    const categoryId = 5;

    service.getThreadsByCategory(categoryId).subscribe((threads) => {
      expect(threads).toEqual(mockThreads);
    });

    const req = httpMock.expectOne(
      `http://localhost:8080/api/temas/categoria/${categoryId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockThreads);
  });

  it('debería crear un tema con header de autorización', () => {
    const nuevoTema = {
      usuarioId: 1,
      categoriaId: 2,
      titulo: 'Nuevo tema',
      contenido: 'Contenido del nuevo tema',
    };

    const mockResponse = { id: 3, ...nuevoTema };

    service.crearTema(nuevoTema).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/temas/crear');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevoTema);
    expect(req.request.headers.get('Authorization')).toBe(authHeader);
    req.flush(mockResponse);
  });
});
