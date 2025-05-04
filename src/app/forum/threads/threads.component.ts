import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Thread } from '../../models/thread.model';
import { ThreadService } from '../../services/thread.service';
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
  threads: Thread[] = [];

  constructor(
    private route: ActivatedRoute,
    private threadService: ThreadService
  ) {}

  ngOnInit(): void {
    this.categoryId = Number(this.route.snapshot.paramMap.get('id'));

    this.threadService.getThreadsByCategory(this.categoryId).subscribe({
      next: (data) => {
        this.threads = data;
        if (data.length > 0) {
          this.categoryName = data[0].categoria.nombre;
        }
      },
      error: (err) => console.error('Error cargando hilos', err),
    });
  }
}
