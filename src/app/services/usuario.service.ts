import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Usuario {
  nombre: string;
  email: string;
  password: string;
  rol: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const headers = {
      Authorization: 'Basic ' + btoa(`${email}:${password}`),
    };

    return this.http.get(`${this.apiUrl}/me`, { headers });
  }

  register(usuario: any): Observable<Usuario> {
    return this.http.post<Usuario>(
      'http://localhost:8080/api/usuarios/registro',
      usuario
    );
  }

  actualizarPerfil(datos: any): Observable<any> {
    const headers = {
      Authorization: localStorage.getItem('authHeader') || '',
    };

    return this.http.put('http://localhost:8080/api/usuarios/me', datos, {
      headers,
    });
  }
}
