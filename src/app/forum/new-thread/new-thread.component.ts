import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ThreadService } from '../../services/thread.service';
import { Thread } from '../../models/thread.model';
import { CategoryService, Category } from '../../services/category.service';

@Component({
  selector: 'app-new-thread',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './new-thread.component.html',
  styleUrl: './new-thread.component.css',
})
export class NewThreadComponent implements OnInit {
  threadForm!: FormGroup;
  categories: Category[] = [];
  user: any = null;
  submitted = false;
  success = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private threadService: ThreadService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('loggedUser');
    this.user = userData ? JSON.parse(userData) : null;

    this.threadForm = this.fb.group({
      categoryId: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
    });

    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error cargando categorías', err);
      },
    });
  }

  onSubmit() {
    this.submitted = true;
    this.success = '';

    if (this.threadForm.invalid || !this.user) return;

    const { categoryId, title, content } = this.threadForm.value;

    const nuevoTema = {
      usuarioId: this.user.id,
      categoriaId: Number(categoryId),
      titulo: title,
      contenido: content,
    };

    this.threadService.crearTema(nuevoTema).subscribe({
      next: () => {
        this.success = 'Tema publicado con éxito. Redirigiendo...';
        this.threadForm.reset();
        this.submitted = false;

        setTimeout(() => {
          this.router.navigate(['/category', categoryId]);
        }, 2000);
      },
      error: (err) => {
        console.error('Error al crear tema', err);
      },
    });
  }
}
