import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-threads',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './threads.component.html',
  styleUrl: './threads.component.css',
})
export class ThreadsComponent implements OnInit {
  categoryId!: number;
  categoryName = '';
  threads: any[] = [];

  allThreads = [
    {
      id: 1,
      categoryId: 1,
      title: '¿Mejor laptop para desarrollo?',
      author: 'octavio@mail.com',
      date: '2025-04-10',
    },
    {
      id: 2,
      categoryId: 1,
      title: 'Inteligencia Artificial en 2025',
      author: 'ana@mail.com',
      date: '2025-04-08',
    },
    {
      id: 3,
      categoryId: 2,
      title: 'Métodos de estudio efectivos',
      author: 'juan@mail.com',
      date: '2025-04-07',
    },
    {
      id: 4,
      categoryId: 3,
      title: 'Películas chilenas recomendadas',
      author: 'carla@mail.com',
      date: '2025-04-06',
    },
  ];

  categories = [
    { id: 1, name: 'Tecnología' },
    { id: 2, name: 'Educación' },
    { id: 3, name: 'Cultura' },
    { id: 4, name: 'Salud' },
    { id: 5, name: 'Videojuegos' },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.categoryId = Number(this.route.snapshot.paramMap.get('id'));
    this.categoryName =
      this.categories.find((c) => c.id === this.categoryId)?.name ||
      'Desconocida';

    // Cargar todos los temas desde localStorage
    const threads = JSON.parse(localStorage.getItem('threads') || '[]');

    // Filtrar por categoría
    this.threads = threads.filter((t: any) => t.categoryId === this.categoryId);
  }
}
