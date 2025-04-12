import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  user: any = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const data = localStorage.getItem('loggedUser');
    this.user = data ? JSON.parse(data) : null;
    this.route.queryParams.subscribe((params) => {
      if (params['msg'] === 'not-authorized') {
        alert(
          'Acceso restringido: solo administradores pueden ver esa página.'
        );
      }
    });
  }
}
