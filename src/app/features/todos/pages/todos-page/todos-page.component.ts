import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { TodoFormComponent } from '../../components/todo-form/todo-form.component';
import { TodoFiltersComponent } from '../../components/todo-filters/todo-filters.component';
import { TodoListComponent } from '../../components/todo-list/todo-list.component';

@Component({
  selector: 'app-todos-page',
  standalone: true,
  imports: [AsyncPipe, TodoFormComponent, TodoFiltersComponent, TodoListComponent],
  templateUrl: './todos-page.component.html',
  styleUrl: './todos-page.component.scss',
})
export class TodosPageComponent {
  private readonly auth = inject(AuthService);
  readonly currentUser$ = this.auth.currentUser$;
}
