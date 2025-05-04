import { TestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

interface Category {
  id: number;
  nombre: string;
}

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  const mockCategories: Category[] = [
    { id: 1, nombre: 'General' },
    { id: 2, nombre: 'Anuncios' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService],
    });

    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería hacer GET y retornar las categorías', () => {
    service.getCategories().subscribe((categories) => {
      expect(categories.length).toBe(2);
      expect(categories).toEqual(mockCategories);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/categorias');
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });
});
