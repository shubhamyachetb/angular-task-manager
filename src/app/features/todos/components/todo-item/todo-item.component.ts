import { Component, inject, input, output } from '@angular/core';
import { Todo } from '../../../../core/models/todo.model';
import { HighlightDirective } from '../../../../shared/directives/highlight.directive';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [HighlightDirective, ButtonComponent],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
})
export class TodoItemComponent {
  readonly todo = input.required<Todo>();
  readonly searchTerm = input('');

  readonly toggle = output<string>();
  readonly remove = output<string>();
}
