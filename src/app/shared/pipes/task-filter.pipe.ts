import { Pipe, PipeTransform } from '@angular/core';
import { Todo, TodoFilter } from '../../core/models/todo.model';

@Pipe({
  name: 'taskFilter',
  standalone: true,
})
export class TaskFilterPipe implements PipeTransform {
  transform(todos: Todo[], filter: TodoFilter, search = ''): Todo[] {
    const term = search.trim().toLowerCase();

    return todos
      .filter((t) => this.matchesFilter(t, filter))
      .filter((t) => !term || t.title.toLowerCase().includes(term));
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
