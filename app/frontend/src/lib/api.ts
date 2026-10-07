import { buildUrl } from './apiConfig';
import type {
  ChatRequest,
  ChatResponse,
  HealthStatus,
  KnowledgeDocument,
  UploadResult,
} from '@/types';

const NETWORK_ERROR_MESSAGE =
  'Connection problem — the MZI RAG service could not be reached. Please try again in a moment.';

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function parseError(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();

    if (typeof data?.detail === 'string' && data.detail.trim()) {
      return data.detail;
    }

    if (typeof data?.message === 'string' && data.message.trim()) {
      return data.message;
    }

    return fallback;
  } catch {
    return fallback;
  }
}

function throwNetworkError(): never {
  throw new ApiError(NETWORK_ERROR_MESSAGE);
}

export async function checkHealth(): Promise<HealthStatus> {
  try {
    const res = await fetch(buildUrl('/health'), { method: 'GET' });
    if (!res.ok) return { status: 'error', detail: `HTTP ${res.status}` };
    const data = await res.json().catch(() => ({}));
    return { status: 'ok', detail: data?.status ?? 'ok' };
  } catch {
    return { status: 'unknown' };
  }
}

export async function sendChat(req: ChatRequest): Promise<ChatResponse> {
  let res: Response;

  try {
    res = await fetch(buildUrl('/chat'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
  } catch {
    return throwNetworkError();
  }

  if (!res.ok) {
    const msg = await parseError(res, `The service returned an error (HTTP ${res.status}).`);
    throw new ApiError(msg, res.status);
  }

  const data = (await res.json().catch(() => null)) as ChatResponse | null;
  if (!data || typeof data.answer !== 'string') {
    throw new ApiError('The service returned an invalid response.');
  }

  return data;
}

export async function uploadDocument(file: File): Promise<UploadResult> {
  if (!file) return { success: false, message: 'No file selected.' };

  if (!file.name.toLowerCase().endsWith('.pdf')) {
    return { success: false, message: 'Only PDF files are supported.' };
  }

  const formData = new FormData();
  formData.append('file', file);

  let res: Response;

  try {
    res = await fetch(buildUrl('/document/upload'), {
      method: 'POST',
      body: formData,
    });
  } catch {
    return throwNetworkError();
  }

  if (!res.ok) {
    const msg = await parseError(res, `The service returned an error (HTTP ${res.status}).`);
    throw new ApiError(msg, res.status);
  }

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;

  const filename =
    (data.filename as string) ??
    (data.name as string) ??
    file.name;

  const doc: KnowledgeDocument = {
    id: filename,
    name: filename,
    pages:
      (data.pages as number) ??
      (data.pages_loaded as number) ??
      (data.total_pages as number) ??
      undefined,
    uploadedAt: new Date().toISOString(),
  };

  return {
    success: true,
    document: doc,
    message: 'Document uploaded successfully.',
  };
}

export async function deleteDocument(documentId: string): Promise<void> {
  let res: Response;

  try {
    res = await fetch(buildUrl(`/document/${encodeURIComponent(documentId)}`), {
      method: 'DELETE',
    });
  } catch {
    return throwNetworkError();
  }

  if (!res.ok && res.status !== 404) {
    const msg = await parseError(
      res,
      `The service returned an error (HTTP ${res.status}).`,
    );
    throw new ApiError(msg, res.status);
  }
}

export async function listDocuments(): Promise<KnowledgeDocument[]> {
  let res: Response;

  try {
    // FastAPI exposes GET /document, not /documents.
    res = await fetch(buildUrl('/document'), { method: 'GET' });
  } catch {
    return throwNetworkError();
  }

  if (!res.ok) {
    const msg = await parseError(
      res,
      `The service returned an error (HTTP ${res.status}).`,
    );
    throw new ApiError(msg, res.status);
  }

  const data = (await res.json().catch(() => null)) as
    | { documents?: Array<Record<string, unknown>> }
    | Array<Record<string, unknown>>
    | null;

  const rawDocuments = Array.isArray(data)
    ? data
    : data && Array.isArray(data.documents)
      ? data.documents
      : [];

  const documents: KnowledgeDocument[] = [];

  for (const doc of rawDocuments) {
    const filename =
      (doc.filename as string) ??
      (doc.name as string) ??
      '';

    if (!filename) continue;

    documents.push({
      id: (doc.id as string) ?? filename,
      name: filename,
      pages:
        (doc.pages as number) ??
        (doc.pages_loaded as number) ??
        (doc.total_pages as number) ??
        undefined,
      uploadedAt: doc.uploadedAt as string | undefined,
    });
  }

  return documents;
}
