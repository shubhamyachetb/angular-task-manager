import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map, of, tap } from 'rxjs';
import { ChatApiMessage, ChatMessage, ChatResponse } from '../models/chat.model';

@Injectable({ providedIn: 'root' })
export class HelpChatService {
  private readonly http = inject(HttpClient);

  readonly isOpen = signal(false);
  readonly messages = signal<ChatMessage[]>([
    {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: 'Hi! Ask me about tasks or this app. I keep answers short.',
      createdAt: new Date().toISOString(),
    },
  ]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  open(): void {
    this.isOpen.set(true);
    this.error.set(null);
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggle(): void {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      this.error.set(null);
    }
  }

  sendMessage(text: string): void {
    const trimmed = text.trim();
    if (!trimmed || this.loading()) {
      return;
    }

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    this.messages.update((list) => [...list, userMsg]);
    this.loading.set(true);
    this.error.set(null);

    const payload: ChatApiMessage[] = this.messages()
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: m.content }));

    this.http
      .post<ChatResponse>('/api/chat', { messages: payload })
      .pipe(
        map((res) => res.reply),
        tap((reply) => {
          const assistantMsg: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: reply,
            createdAt: new Date().toISOString(),
          };
          this.messages.update((list) => [...list, assistantMsg]);
        }),
        catchError((err) => {
          this.error.set(this.parseChatError(err));
          return of(null);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  private parseChatError(err: { status?: number; error?: { error?: string }; message?: string }): string {
    const apiMsg = err?.error?.error;
    if (apiMsg) {
      if (/quota|billing|insufficient/i.test(apiMsg)) {
        return 'OpenAI quota exceeded. Add billing or credits at platform.openai.com → Settings → Billing, then try again.';
      }
      return apiMsg;
    }
    if (err?.status === 0 || err?.status === 500) {
      return 'API server not running. In a second terminal run: npm run start:api (or use npm run dev).';
    }
    if (err?.status === 503) {
      return 'Add OPENAI_API_KEY to a .env file in the project root (copy from .env.example).';
    }
    return err?.message || 'Help is unavailable. Check the API server and .env file.';
  }

  clearChat(): void {
    this.messages.set([
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Chat cleared. How can I help?',
        createdAt: new Date().toISOString(),
      },
    ]);
    this.error.set(null);
  }
}
