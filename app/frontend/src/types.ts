export interface ChatRequest {
  session_id: string;
  question: string;
}

export interface ChatSource {
  document?: string;
  page?: number;
  metadata?: Record<string, unknown>;
}

export interface ChatResponse {
  question: string;
  answer: string;
  sources?: ChatSource[];
}

export interface KnowledgeDocument {
  id: string;
  name: string;
  pages?: number;
  uploadedAt?: string;
}

export interface HealthStatus {
  status: 'ok' | 'error' | 'unknown';
  detail?: string;
}

export interface UploadResult {
  success: boolean;
  document?: KnowledgeDocument;
  message?: string;
}

export type Theme = 'light' | 'dark';
