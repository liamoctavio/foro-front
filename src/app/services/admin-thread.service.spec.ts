import { TestBed } from '@angular/core/testing';
import { AdminThreadService } from './admin-thread.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Thread } from '../models/thread.model';

describe('AdminThreadService', () => {
  let service: AdminThreadService;
  let httpMock: HttpTestingController;

  const mockThreads: Thread[] = [
    {
      id: 1,
      titulo: 'Tema 1',
      contenido: 'Contenido 1',
      usuario: {
        id: 1,
        nombre: 'Usuario1',
        email: 'usuario1@example.com',
        rol: 'admin',
      },
      categoria: { id: 1, nombre: 'Categoria1' },
    },
    {
      id: 2,
      titulo: 'Tema 2',
      contenido: 'Contenido 2',
      usuario: {
        id: 2,
        nombre: 'Usuario2',
        email: 'usuario2@example.com',
        rol: 'user',
      },
      categoria: { id: 2, nombre: 'Categoria2' },
    },
  ];

  beforeEach(() => {
    localStorage.setItem('authHeader', 'Basic abc123');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminThreadService],
    });

    service = TestBed.inject(AdminThreadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('debería obtener todos los temas con header de autorización', () => {
    service.getAll().subscribe((data) => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockThreads);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/temas');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Basic abc123');
    req.flush(mockThreads);
  });

  // it('debería eliminar un tema por ID con header de autorización', () => {
  //   const threadId = 1;

  //   service.delete(threadId).subscribe((response) => {
  //     expect(response).toBeUndefined(); // porque devuelve void
  //   });

  //   const req = httpMock.expectOne(
  //     `http://localhost:8080/api/temas/${threadId}`
  //   );
  //   expect(req.request.method).toBe('DELETE');
  //   expect(req.request.headers.get('Authorization')).toBe('Basic abc123');
  //   req.flush(null);
  // });
});
