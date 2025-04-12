import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'foro-front';

  isLoggedIn(): boolean {
    return !!localStorage.getItem('loggedUser');
  }

  logout(): void {
    localStorage.removeItem('loggedUser');
    location.reload(); // recarga para refrescar navbar
  }

  getUserRole(): string {
    const user = localStorage.getItem('loggedUser');
    return user ? JSON.parse(user).role : '';
  }
}
