import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThreadComponent } from './thread.component';
import { CommentService } from '../../services/comment.service';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('ThreadComponent', () => {
  let component: ThreadComponent;
  let fixture: ComponentFixture<ThreadComponent>;
  let commentServiceSpy: jasmine.SpyObj<CommentService>;

  const mockComments = [
    { id: 1, contenido: 'Comentario 1' },
    { id: 2, contenido: 'Comentario 2' },
  ];

  const mockUser = { id: 10, nombre: 'Octavio' };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CommentService', [
      'getCommentsByThreadId',
      'postComment',
    ]);

    await TestBed.configureTestingModule({
      imports: [ThreadComponent, ReactiveFormsModule],
      providers: [
        { provide: CommentService, useValue: spy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '123', // threadId simulado
              },
            },
          },
        },
      ],
    }).compileComponents();

    localStorage.setItem('loggedUser', JSON.stringify(mockUser));

    fixture = TestBed.createComponent(ThreadComponent);
    component = fixture.componentInstance;
    commentServiceSpy = TestBed.inject(
      CommentService
    ) as jasmine.SpyObj<CommentService>;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar comentarios y usuario en ngOnInit', () => {
    commentServiceSpy.getCommentsByThreadId.and.returnValue(of(mockComments));
    fixture.detectChanges();

    expect(component.threadId).toBe(123);
    expect(commentServiceSpy.getCommentsByThreadId).toHaveBeenCalledWith(123);
    expect(component.comments.length).toBe(2);
    expect(component.user).toEqual(mockUser);
    expect(component.commentForm).toBeTruthy();
  });

  // it('no debería publicar si el formulario es inválido', () => {
  //   fixture.detectChanges(); // inicia formulario
  //   component.commentForm.setValue({ content: '' }); // inválido
  //   component.onComment();

  //   expect(commentServiceSpy.postComment).not.toHaveBeenCalled();
  // });

  // it('no debería publicar si no hay usuario', () => {
  //   localStorage.clear(); // simula sesión cerrada
  //   fixture.detectChanges();
  //   component.user = null;
  //   component.commentForm.setValue({ content: 'Hola mundo' });

  //   component.onComment();

  //   expect(commentServiceSpy.postComment).not.toHaveBeenCalled();
  // });

  // it('debería publicar un comentario válido', () => {
  //   fixture.detectChanges();
  //   const nuevoComentario = { id: 3, contenido: 'Nuevo comentario' };

  //   commentServiceSpy.postComment.and.returnValue(of(nuevoComentario));

  //   component.commentForm.setValue({ content: 'Nuevo comentario' });

  //   component.onComment();

  //   expect(commentServiceSpy.postComment).toHaveBeenCalledWith(
  //     123,
  //     'Nuevo comentario'
  //   );
  //   expect(component.comments).toContain(nuevoComentario);
  //   expect(component.commentForm.value.content).toBeNull(); // formulario reseteado
  // });

  // it('debería manejar error al publicar comentario', () => {
  //   spyOn(console, 'error');
  //   fixture.detectChanges();

  //   component.commentForm.setValue({ content: 'Comentario con error' });

  //   commentServiceSpy.postComment.and.returnValue(
  //     throwError(() => new Error('Error de red'))
  //   );

  //   component.onComment();

  //   expect(console.error).toHaveBeenCalledWith(
  //     'Error al publicar comentario',
  //     jasmine.any(Error)
  //   );
  // });
});
