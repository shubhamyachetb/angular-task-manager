import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  readonly label = input.required<string>();
  readonly control = input.required<FormControl<string>>();
  readonly type = input<'text' | 'email' | 'password'>('text');
  readonly placeholder = input('');
  readonly autocomplete = input<string>('');

  hasError(): boolean {
    const c = this.control();
    return c.invalid && (c.dirty || c.touched);
  }

  errorMessage(): string | null {
    const c = this.control();
    if (!this.hasError()) {
      return null;
    }

    const errors = c.errors;
    if (!errors) {
      return null;
    }

    if (errors['required']) {
      return `${this.label()} is required.`;
    }
    if (errors['email']) {
      return 'Enter a valid email address.';
    }
    if (errors['minlength']) {
      return `${this.label()} must be at least ${errors['minlength'].requiredLength} characters.`;
    }
    if (errors['passwordMismatch']) {
      return 'Passwords do not match.';
    }

    return 'Invalid value.';
  }
}
