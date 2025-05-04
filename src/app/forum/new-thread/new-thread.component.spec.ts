import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NewThreadComponent } from './new-thread.component';
import { ThreadService } from '../../services/thread.service';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('NewThreadComponent', () => {
  let component: NewThreadComponent;
  let fixture: ComponentFixture<NewThreadComponent>;
  let threadServiceSpy: jasmine.SpyObj<ThreadService>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockCategories = [
    { id: 1, nombre: 'General' },
    { id: 2, nombre: 'Noticias' },
  ];

  const mockUser = { id: 42, nombre: 'Octavio' };

  beforeEach(async () => {
    localStorage.setItem('loggedUser', JSON.stringify(mockUser));

    const threadSpy = jasmine.createSpyObj('ThreadService', ['crearTema']);
    const categorySpy = jasmine.createSpyObj('CategoryService', [
      'getCategories',
    ]);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [NewThreadComponent, ReactiveFormsModule],
      providers: [
        { provide: ThreadService, useValue: threadSpy },
        { provide: CategoryService, useValue: categorySpy },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewThreadComponent);
    component = fixture.componentInstance;
    threadServiceSpy = TestBed.inject(
      ThreadService
    ) as jasmine.SpyObj<ThreadService>;
    categoryServiceSpy = TestBed.inject(
      CategoryService
    ) as jasmine.SpyObj<CategoryService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    categoryServiceSpy.getCategories.and.returnValue(of(mockCategories));

    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('loggedUser');
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar el usuario desde localStorage', () => {
    expect(component.user).toEqual(mockUser);
  });

  it('debería cargar categorías desde el servicio', () => {
    expect(categoryServiceSpy.getCategories).toHaveBeenCalled();
    expect(component.categories.length).toBe(2);
  });

  it('no debería enviar el formulario si es inválido o no hay usuario', () => {
    component.user = null;
    component.threadForm.setValue({ categoryId: '', title: '', content: '' });
    component.onSubmit();
    expect(threadServiceSpy.crearTema).not.toHaveBeenCalled();
  });

  it('debería crear un tema si el formulario es válido', fakeAsync(() => {
    threadServiceSpy.crearTema.and.returnValue(of({}));

    component.threadForm.setValue({
      categoryId: '1',
      title: 'Título válido',
      content: 'Contenido válido con más de 10 caracteres',
    });

    component.onSubmit();

    expect(threadServiceSpy.crearTema).toHaveBeenCalledWith({
      usuarioId: mockUser.id,
      categoriaId: 1,
      titulo: 'Título válido',
      contenido: 'Contenido válido con más de 10 caracteres',
    });

    expect(component.success).toContain('Tema publicado');
    tick(2000);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/category', '1']);
  }));

  // it('debería manejar error al cargar categorías', () => {
  //   categoryServiceSpy.getCategories.and.returnValue(
  //     throwError(() => new Error('Falla de red'))
  //   );

  //   component.ngOnInit();
  //   expect(component.categories).toEqual([]);
  // });

  it('debería manejar error al crear tema', () => {
    spyOn(console, 'error');
    threadServiceSpy.crearTema.and.returnValue(
      throwError(() => new Error('Error al crear tema'))
    );

    component.threadForm.setValue({
      categoryId: '1',
      title: 'Título válido',
      content: 'Contenido válido con más de 10 caracteres',
    });

    component.onSubmit();
    expect(console.error).toHaveBeenCalledWith(
      'Error al crear tema',
      jasmine.any(Error)
    );
  });
});
