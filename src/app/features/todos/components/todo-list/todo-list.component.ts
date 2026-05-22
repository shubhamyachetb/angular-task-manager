import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { combineLatest, map } from 'rxjs';
import { TodoService } from '../../services/todo.service';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TaskFilterPipe } from '../../../../shared/pipes/task-filter.pipe';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [AsyncPipe, TodoItemComponent, TaskFilterPipe],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent {
  private readonly todos = inject(TodoService);

  readonly viewModel$ = combineLatest([
    this.todos.todos$,
    this.todos.filter$,
    this.todos.search$,
  ]).pipe(map(([todos, filter, search]) => ({ todos, filter, search })));

  onToggle(id: string): void {
    this.todos.toggleComplete(id);
  }

  onRemove(id: string): void {
    this.todos.deleteTask(id);
  }
}
