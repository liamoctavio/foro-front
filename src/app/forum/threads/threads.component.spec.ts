import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThreadsComponent } from './threads.component';
import { ThreadService } from '../../services/thread.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Thread } from '../../models/thread.model';

describe('ThreadsComponent', () => {
  let component: ThreadsComponent;
  let fixture: ComponentFixture<ThreadsComponent>;
  let threadServiceSpy: jasmine.SpyObj<ThreadService>;

  const mockThreads: Thread[] = [
    {
      id: 1,
      titulo: 'Título 1',
      contenido: 'Contenido 1',
      usuario: {
        id: 1,
        nombre: 'Usuario 1',
        email: 'user1@example.com',
        rol: 'admin',
      },
      categoria: { id: 1, nombre: 'General' },
    },
    {
      id: 2,
      titulo: 'Título 2',
      contenido: 'Contenido 2',
      usuario: {
        id: 2,
        nombre: 'Usuario 2',
        email: 'user2@example.com',
        rol: 'user',
      },
      categoria: { id: 1, nombre: 'General' },
    },
  ];

  beforeEach(async () => {
    const threadSpy = jasmine.createSpyObj('ThreadService', [
      'getThreadsByCategory',
    ]);

    await TestBed.configureTestingModule({
      imports: [ThreadsComponent],
      providers: [
        { provide: ThreadService, useValue: threadSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1', // Simula categoría ID = 1
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ThreadsComponent);
    component = fixture.componentInstance;
    threadServiceSpy = TestBed.inject(
      ThreadService
    ) as jasmine.SpyObj<ThreadService>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los hilos por categoría y asignar el nombre', () => {
    threadServiceSpy.getThreadsByCategory.and.returnValue(of(mockThreads));

    fixture.detectChanges(); // llama ngOnInit

    expect(component.categoryId).toBe(1);
    expect(threadServiceSpy.getThreadsByCategory).toHaveBeenCalledWith(1);
    expect(component.threads).toEqual(mockThreads);
    expect(component.categoryName).toBe('General');
  });

  it('debería dejar categoryName vacío si no hay hilos', () => {
    threadServiceSpy.getThreadsByCategory.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component.threads).toEqual([]);
    expect(component.categoryName).toBe('');
  });

  it('debería manejar error al cargar hilos', () => {
    spyOn(console, 'error');
    threadServiceSpy.getThreadsByCategory.and.returnValue(
      throwError(() => new Error('Falla de red'))
    );

    fixture.detectChanges();

    expect(console.error).toHaveBeenCalledWith(
      'Error cargando hilos',
      jasmine.any(Error)
    );
  });
});
