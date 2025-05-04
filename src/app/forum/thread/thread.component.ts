import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommentService } from '../../services/comment.service';

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

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    this.threadId = Number(this.route.snapshot.paramMap.get('id'));

    this.commentService.getCommentsByThreadId(this.threadId).subscribe({
      next: (data: any[]) => (this.comments = data),
      error: (err: any) => console.error('Error cargando comentarios', err),
    });

    const storedUser = localStorage.getItem('loggedUser');
    this.user = storedUser ? JSON.parse(storedUser) : null;

    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onComment() {
    if (this.commentForm.invalid || !this.user) return;

    const contenido = this.commentForm.value.content;

    this.commentService.postComment(this.threadId, contenido).subscribe({
      next: (nuevoComentario) => {
        this.comments.push(nuevoComentario);
        this.commentForm.reset();
      },
      error: (err) => {
        console.error('Error al publicar comentario', err);
      },
    });
  }
}
