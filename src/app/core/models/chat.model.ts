export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface ChatApiMessage {
  role: ChatRole;
  content: string;
}

export interface ChatResponse {
  reply: string;
}
