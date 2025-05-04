import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminThreadService } from '../../services/admin-thread.service';
import { Thread } from '../../models/thread.model';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css',
})
export class PanelComponent implements OnInit {
  temas: Thread[] = [];
  loading = false;
  error = '';

  constructor(private adminThreadService: AdminThreadService) {}

  ngOnInit(): void {
    this.loadTemas();
  }

  loadTemas() {
    this.loading = true;
    this.adminThreadService.getAll().subscribe({
      next: (data) => {
        this.temas = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudieron cargar los temas.';
        console.error(err);
        this.loading = false;
      },
    });
  }

  eliminarTema(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este tema?')) return;
    this.adminThreadService.delete(id).subscribe({
      next: () => this.loadTemas(), // recarga la lista
      error: (err) => {
        this.error = 'Error al eliminar el tema.';
        console.error(err);
      },
    });
  }
  // temas: any[] = [];

  // ngOnInit(): void {
  //   const datos = localStorage.getItem('threads');
  //   this.temas = datos ? JSON.parse(datos) : [];
  // }

  // banearTema(id: number) {
  //   const index = this.temas.findIndex((t) => t.id === id);
  //   if (index !== -1) {
  //     this.temas[index].baneado = true;
  //     localStorage.setItem('threads', JSON.stringify(this.temas));
  //   }
  // }

  // eliminarTema(id: number) {
  //   this.temas = this.temas.filter((t) => t.id !== id);
  //   localStorage.setItem('threads', JSON.stringify(this.temas));
  // }
}
