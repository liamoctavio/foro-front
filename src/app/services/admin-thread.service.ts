import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Thread } from '../models/thread.model';

@Injectable({
  providedIn: 'root',
})
export class AdminThreadService {
  private apiUrl = 'http://localhost:8080/api/temas';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Thread[]> {
    const headers = new HttpHeaders({
      Authorization: localStorage.getItem('authHeader') || '',
    });
    return this.http.get<Thread[]>(this.apiUrl, { headers });
  }

  delete(id: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: localStorage.getItem('authHeader') || '',
    });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
