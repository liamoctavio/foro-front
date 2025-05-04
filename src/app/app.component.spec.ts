import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  const mockUser = {
    nombre: 'Octavio',
    rol: 'ADMIN',
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería retornar true si el usuario está logueado', () => {
    localStorage.setItem('loggedUser', JSON.stringify(mockUser));
    expect(component.isLoggedIn()).toBeTrue();
  });

  it('debería retornar false si no hay usuario logueado', () => {
    expect(component.isLoggedIn()).toBeFalse();
  });

  // it('debería eliminar al usuario y recargar la página al hacer logout', () => {
  //   localStorage.setItem('loggedUser', JSON.stringify(mockUser));

  //   const reloadSpy = spyOn(window.location, 'reload' as any).and.callFake(
  //     () => {}
  //   );

  //   component.logout();

  //   expect(localStorage.getItem('loggedUser')).toBeNull();
  //   expect(reloadSpy).toHaveBeenCalled();
  // });

  it('debería retornar el rol del usuario en minúsculas', () => {
    localStorage.setItem('loggedUser', JSON.stringify(mockUser));
    expect(component.getUserRole()).toBe('admin');
  });

  it('debería retornar cadena vacía si no hay usuario', () => {
    expect(component.getUserRole()).toBe('');
  });

  // beforeEach(async () => {
  //   await TestBed.configureTestingModule({
  //     imports: [AppComponent],
  //   }).compileComponents();
  // });

  // it('should create the app', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.componentInstance;
  //   expect(app).toBeTruthy();
  // });

  // it(`should have the 'foro-front' title`, () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.componentInstance;
  //   expect(app.title).toEqual('foro-front');
  // });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   expect(compiled.querySelector('h1')?.textContent).toContain('Hello, foro-front');
  // });
});
