import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Thread } from '../models/thread.model';

@Injectable({
  providedIn: 'root',
})
export class ThreadService {
  private apiUrl = 'http://localhost:8080/api/temas';

  constructor(private http: HttpClient) {}

  getThreadsByCategory(categoryId: number): Observable<Thread[]> {
    return this.http.get<Thread[]>(`${this.apiUrl}/categoria/${categoryId}`);
  }

  crearTema(data: any): Observable<any> {
    const authHeader = localStorage.getItem('authHeader') || '';
    const headers = new HttpHeaders({
      Authorization: authHeader,
    });

    return this.http.post(`${this.apiUrl}/crear`, data, { headers });
  }
}
