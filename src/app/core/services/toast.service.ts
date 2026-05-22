import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  text: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly messagesSubject = new BehaviorSubject<ToastMessage[]>([]);
  readonly messages$ = this.messagesSubject.asObservable();

  show(text: string, type: ToastType = 'info', durationMs = 3500): void {
    const toast: ToastMessage = { id: crypto.randomUUID(), text, type };
    const current = this.messagesSubject.value;
    this.messagesSubject.next([...current, toast]);

    setTimeout(() => this.dismiss(toast.id), durationMs);
  }

  dismiss(id: string): void {
    this.messagesSubject.next(
      this.messagesSubject.value.filter((m) => m.id !== id),
    );
  }
}
