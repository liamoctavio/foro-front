import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-new-thread',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './new-thread.component.html',
  styleUrl: './new-thread.component.css',
})
export class NewThreadComponent implements OnInit {
  threadForm!: FormGroup;
  categories = [
    { id: 1, name: 'Tecnología' },
    { id: 2, name: 'Educación' },
    { id: 3, name: 'Cultura' },
    { id: 4, name: 'Salud' },
    { id: 5, name: 'Videojuegos' },
  ];
  user: any = null;
  submitted = false;
  success = '';

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('loggedUser');
    this.user = userData ? JSON.parse(userData) : null;

    this.threadForm = this.fb.group({
      categoryId: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit() {
    this.submitted = true;
    this.success = '';

    if (this.threadForm.invalid || !this.user) return;

    const { categoryId, title, content } = this.threadForm.value;
    const threads = JSON.parse(localStorage.getItem('threads') || '[]');

    const newThread = {
      id: Date.now(), // ID único simulado
      categoryId: Number(categoryId),
      title,
      content,
      author: this.user.email,
      date: new Date().toISOString().slice(0, 10),
    };

    threads.push(newThread);
    localStorage.setItem('threads', JSON.stringify(threads));

    this.success = 'Tema publicado con éxito. Redirigiendo...';
    this.threadForm.reset();
    this.submitted = false;

    setTimeout(() => {
      this.router.navigate(['/category', categoryId]);
    }, 2000);
  }
}
