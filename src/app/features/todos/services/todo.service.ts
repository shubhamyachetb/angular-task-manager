import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { StorageService } from '../../../core/services/storage.service';
import { tasksKey } from '../../../core/models/storage-keys';
import { Todo, TodoFilter } from '../../../core/models/todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly storage = inject(StorageService);
  private readonly auth = inject(AuthService);

  private readonly todosSubject = new BehaviorSubject<Todo[]>([]);
  private readonly filterSubject = new BehaviorSubject<TodoFilter>('all');
  private readonly searchSubject = new BehaviorSubject<string>('');

  readonly todos$ = this.todosSubject.asObservable();
  readonly filter$ = this.filterSubject.asObservable();
  readonly search$ = this.searchSubject.asObservable();

  readonly filteredTodos$: Observable<Todo[]> = combineLatest([
    this.todos$,
    this.filter$,
    this.search$,
  ]).pipe(
    map(([todos, filter, search]) => {
      const term = search.trim().toLowerCase();
      return todos
        .filter((t) => this.matchesFilter(t, filter))
        .filter((t) => !term || t.title.toLowerCase().includes(term));
    }),
  );

  readonly stats$ = this.todos$.pipe(
    map((todos) => ({
      total: todos.length,
      active: todos.filter((t) => !t.completed).length,
      completed: todos.filter((t) => t.completed).length,
    })),
  );

  constructor() {
    this.auth.currentUser$.subscribe((user) => {
      if (user) {
        this.loadTodos(user.email);
      } else {
        this.todosSubject.next([]);
      }
    });
  }

  addTask(title: string): void {
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }

    const todo: Todo = {
      id: crypto.randomUUID(),
      title: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updated = [todo, ...this.todosSubject.value];
    this.updateTodos(updated);
  }

  deleteTask(id: string): void {
    this.updateTodos(this.todosSubject.value.filter((t) => t.id !== id));
  }

  toggleComplete(id: string): void {
    this.updateTodos(
      this.todosSubject.value.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      ),
    );
  }

  setFilter(filter: TodoFilter): void {
    this.filterSubject.next(filter);
  }

  setSearch(term: string): void {
    this.searchSubject.next(term);
  }

  clearCompleted(): void {
    this.updateTodos(this.todosSubject.value.filter((t) => !t.completed));
  }

  private loadTodos(email: string): void {
    const todos = this.storage.getItem<Todo[]>(tasksKey(email)) ?? [];
    this.todosSubject.next(todos);
    this.filterSubject.next('all');
    this.searchSubject.next('');
  }

  private updateTodos(todos: Todo[]): void {
    const user = this.auth.currentUser;
    if (!user) {
      return;
    }

    this.todosSubject.next(todos);
    this.storage.setItem(tasksKey(user.email), todos);
  }

  private matchesFilter(todo: Todo, filter: TodoFilter): boolean {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  }
}
