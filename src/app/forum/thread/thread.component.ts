import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.css',
})
export class ThreadComponent implements OnInit {
  threadId!: number;
  thread: any;
  comments: any[] = [];
  commentForm!: FormGroup;
  user: any = null;

  allThreads = [
    {
      id: 1,
      categoryId: 1,
      title: '¿Mejor laptop para desarrollo?',
      content: 'Estoy buscando recomendaciones de laptops para programación.',
      author: 'octavio@mail.com',
      date: '2025-04-10',
    },
    {
      id: 2,
      categoryId: 1,
      title: 'Inteligencia Artificial en 2025',
      content: '¿Qué opinan del impacto de la IA este año?',
      author: 'ana@mail.com',
      date: '2025-04-08',
    },
    {
      id: 3,
      categoryId: 2,
      title: 'Métodos de estudio efectivos',
      content: 'Compartan técnicas que les funcionen para estudiar.',
      author: 'juan@mail.com',
      date: '2025-04-07',
    },
    {
      id: 4,
      categoryId: 3,
      title: 'Películas chilenas recomendadas',
      content: 'Busco buenas películas nacionales para ver.',
      author: 'carla@mail.com',
      date: '2025-04-06',
    },
  ];

  constructor(private route: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.threadId = Number(this.route.snapshot.paramMap.get('id'));
    this.thread = this.allThreads.find((t) => t.id === this.threadId);

    // Comentarios simulados por hilo
    this.comments = JSON.parse(
      localStorage.getItem(`comments_${this.threadId}`) || '[]'
    );

    // Usuario logueado
    const storedUser = localStorage.getItem('loggedUser');
    this.user = storedUser ? JSON.parse(storedUser) : null;

    // Formulario de comentario
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onComment() {
    if (this.commentForm.invalid || !this.user) return;

    const newComment = {
      content: this.commentForm.value.content,
      author: this.user.email,
      date: new Date().toISOString().slice(0, 10),
    };

    this.comments.push(newComment);
    localStorage.setItem(
      `comments_${this.threadId}`,
      JSON.stringify(this.comments)
    );
    this.commentForm.reset();
  }
}
