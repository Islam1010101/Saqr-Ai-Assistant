export interface Book {
  id: string;
  title: string;
  author: string;
  subject: string;
  shelf: number;
  row: number;
  // FIX: Added missing properties to match usage in the application, resolving type errors.
  level: string;
  language: 'EN' | 'AR';
  summary: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type Locale = 'ar' | 'en';
export type ChatMode = 'recommend' | 'faq' | 'summary';

export interface LogEntry {
  timestamp: number;
  type: 'search' | 'view';
  value: string; // Search term or book ID
}
