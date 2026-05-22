import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  private readonly toast = inject(ToastService);

  readonly messages$ = this.toast.messages$;

  dismiss(id: string): void {
    this.toast.dismiss(id);
  }
}
