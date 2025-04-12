import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {
  categories = [
    {
      id: 1,
      name: 'Tecnología',
      description: 'Discute sobre software, hardware y más.',
    },
    {
      id: 2,
      name: 'Educación',
      description: 'Temas relacionados con la enseñanza y aprendizaje.',
    },
    {
      id: 3,
      name: 'Cultura',
      description: 'Música, cine, libros y arte en general.',
    },
    {
      id: 4,
      name: 'Salud',
      description: 'Bienestar físico, mental y emocional.',
    },
    {
      id: 5,
      name: 'Videojuegos',
      description: 'Noticias, lanzamientos y debates gamers.',
    },
  ];
}
