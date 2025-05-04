import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelComponent } from './panel.component';
import { AdminThreadService } from '../../services/admin-thread.service';
import { Thread } from '../../models/thread.model';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('PanelComponent', () => {
  let component: PanelComponent;
  let fixture: ComponentFixture<PanelComponent>;
  let mockService: jasmine.SpyObj<AdminThreadService>;

  const mockThreads: Thread[] = [
    { id: 1, titulo: 'Tema 1', contenido: 'Contenido 1' },
    { id: 2, titulo: 'Tema 2', contenido: 'Contenido 2' },
  ] as Thread[];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AdminThreadService', [
      'getAll',
      'delete',
    ]);

    await TestBed.configureTestingModule({
      imports: [PanelComponent, RouterTestingModule, CommonModule],
      providers: [{ provide: AdminThreadService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelComponent);
    component = fixture.componentInstance;
    mockService = TestBed.inject(
      AdminThreadService
    ) as jasmine.SpyObj<AdminThreadService>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los temas correctamente', () => {
    mockService.getAll.and.returnValue(of(mockThreads));
    component.loadTemas();
    expect(component.temas.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('debería manejar error al cargar temas', () => {
    mockService.getAll.and.returnValue(
      throwError(() => new Error('Error de red'))
    );
    component.loadTemas();
    expect(component.error).toBe('No se pudieron cargar los temas.');
    expect(component.loading).toBeFalse();
  });

  it('debería eliminar un tema si se confirma', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockService.delete.and.returnValue(of(undefined));
    mockService.getAll.and.returnValue(of([]));

    component.eliminarTema(1);

    expect(mockService.delete).toHaveBeenCalledWith(1);
    expect(mockService.getAll).toHaveBeenCalled();
  });

  it('no debería eliminar un tema si no se confirma', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.eliminarTema(1);
    expect(mockService.delete).not.toHaveBeenCalled();
  });
});
