import { TestBed } from '@angular/core/testing';
import { CommentService } from './comment.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;

  const authHeader = 'Basic test-auth';
  const threadId = 123;
  const mockComments = [
    { id: 1, contenido: 'Comentario 1' },
    { id: 2, contenido: 'Comentario 2' },
  ];

  beforeEach(() => {
    localStorage.setItem('authHeader', authHeader);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentService],
    });

    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('debería obtener los comentarios por threadId con header', () => {
    service.getCommentsByThreadId(threadId).subscribe((comments) => {
      expect(comments.length).toBe(2);
      expect(comments).toEqual(mockComments);
    });

    const req = httpMock.expectOne(
      `http://localhost:8080/api/comentarios/tema/${threadId}`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(authHeader);
    req.flush(mockComments);
  });

  it('debería enviar un comentario al thread con header', () => {
    const contenido = 'Nuevo comentario';
    const mockResponse = { id: 3, contenido };

    service.postComment(threadId, contenido).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `http://localhost:8080/api/comentarios/tema/${threadId}`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ contenido });
    expect(req.request.headers.get('Authorization')).toBe(authHeader);
    req.flush(mockResponse);
  });
});
