import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    localStorage.setItem('loggedUser', JSON.stringify({ nombre: 'Octavio' }));

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ msg: 'not-authorized' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar el usuario desde localStorage en ngOnInit', () => {
    spyOn(window, 'alert');
    component.ngOnInit();
    expect(component.user).toEqual({ nombre: 'Octavio' });
  });

  it('debería mostrar alerta si msg=not-authorized', () => {
    const alertSpy = spyOn(window, 'alert');
    component.ngOnInit();
    expect(alertSpy).toHaveBeenCalledWith(
      'Acceso restringido: solo administradores pueden ver esa página.'
    );
  });
});
