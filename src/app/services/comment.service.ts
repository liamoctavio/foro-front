import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = 'http://localhost:8080/api/comentarios';

  constructor(private http: HttpClient) {}

  getCommentsByThreadId(threadId: number): Observable<any[]> {
    const headers = {
      Authorization: localStorage.getItem('authHeader') || '',
    };
    return this.http.get<any[]>(`${this.apiUrl}/tema/${threadId}`, { headers });
  }

  postComment(threadId: number, contenido: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: localStorage.getItem('authHeader') || '',
    });

    const body = { contenido };

    return this.http.post(`${this.apiUrl}/tema/${threadId}`, body, { headers });
  }
}
