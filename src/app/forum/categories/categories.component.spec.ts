import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriesComponent } from './categories.component';
import { CategoryService, Category } from '../../services/category.service';
import { of, throwError } from 'rxjs';

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;

  const mockCategories: Category[] = [
    { id: 1, nombre: 'General' },
    { id: 2, nombre: 'Noticias' },
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CategoryService', ['getCategories']);

    await TestBed.configureTestingModule({
      imports: [CategoriesComponent],
      providers: [{ provide: CategoryService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;
    categoryServiceSpy = TestBed.inject(
      CategoryService
    ) as jasmine.SpyObj<CategoryService>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  // it('debería cargar las categorías en ngOnInit', () => {
  //   categoryServiceSpy.getCategories.and.returnValue(of(mockCategories));

  //   fixture.detectChanges();

  //   expect(categoryServiceSpy.getCategories).toHaveBeenCalled();
  //   expect(component.categories.length).toBe(2);
  //   expect(component.categories).toEqual(mockCategories);
  // });

  it('debería manejar error si falla la carga de categorías', () => {
    const consoleSpy = spyOn(console, 'error');
    categoryServiceSpy.getCategories.and.returnValue(
      throwError(() => new Error('Error de red'))
    );

    fixture.detectChanges();

    expect(categoryServiceSpy.getCategories).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error cargando categorías',
      jasmine.any(Error)
    );
    expect(component.categories).toEqual([]);
  });
});
