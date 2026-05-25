import { Component, inject, ElementRef, viewChild, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HelpChatService } from '../../../core/services/help-chat.service';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-help-chat',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './help-chat.component.html',
  styleUrl: './help-chat.component.scss',
})
export class HelpChatComponent {
  private readonly fb = inject(FormBuilder);
  readonly help = inject(HelpChatService);

  private readonly messagesEl = viewChild<ElementRef<HTMLDivElement>>('messagesBox');

  readonly form = this.fb.nonNullable.group({
    message: ['', [Validators.required, Validators.minLength(2)]],
  });

  constructor() {
    effect(() => {
      if (this.help.isOpen() && this.help.messages().length) {
        queueMicrotask(() => this.scrollToBottom());
      }
    });
  }

  close(): void {
    this.help.close();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('help-chat__backdrop')) {
      this.close();
    }
  }

  onSubmit(): void {
    if (this.form.invalid || this.help.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    const text = this.form.controls.message.value;
    this.help.sendMessage(text);
    this.form.reset();
  }

  clear(): void {
    this.help.clearChat();
  }

  private scrollToBottom(): void {
    const el = this.messagesEl()?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }
}
