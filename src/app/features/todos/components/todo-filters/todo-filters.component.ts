import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { TodoFilter } from '../../../../core/models/todo.model';

@Component({
  selector: 'app-todo-filters',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './todo-filters.component.html',
  styleUrl: './todo-filters.component.scss',
})
export class TodoFiltersComponent {
  private readonly fb = inject(FormBuilder);
  private readonly todos = inject(TodoService);

  readonly stats$ = this.todos.stats$;
  readonly activeFilter$ = this.todos.filter$;
  readonly filters: { label: string; value: TodoFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  readonly searchForm = this.fb.nonNullable.group({
    search: [''],
  });

  constructor() {
    this.searchForm.controls.search.valueChanges.subscribe((term) => {
      this.todos.setSearch(term);
    });
  }

  setFilter(filter: TodoFilter): void {
    this.todos.setFilter(filter);
  }

  clearCompleted(): void {
    this.todos.clearCompleted();
  }
}
