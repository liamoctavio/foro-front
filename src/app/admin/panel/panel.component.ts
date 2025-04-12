import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css',
})
export class PanelComponent implements OnInit {
  temas: any[] = [];

  ngOnInit(): void {
    const datos = localStorage.getItem('threads');
    this.temas = datos ? JSON.parse(datos) : [];
  }

  banearTema(id: number) {
    const index = this.temas.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.temas[index].baneado = true;
      localStorage.setItem('threads', JSON.stringify(this.temas));
    }
  }

  eliminarTema(id: number) {
    this.temas = this.temas.filter((t) => t.id !== id);
    localStorage.setItem('threads', JSON.stringify(this.temas));
  }
}
