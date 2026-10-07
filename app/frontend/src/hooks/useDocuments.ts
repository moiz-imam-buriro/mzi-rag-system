import { useCallback, useEffect, useState } from 'react';
import { listDocuments, uploadDocument, deleteDocument, ApiError } from '@/lib/api';
import type { KnowledgeDocument } from '@/types';

export function useDocuments() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const docs = await listDocuments();
      setDocuments(docs);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not load the knowledge base.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const upload = useCallback(async (file: File): Promise<{ ok: boolean; message: string }> => {
    try {
      const result = await uploadDocument(file);
      if (result.success && result.document) {
        await refresh();
        return {
          ok: true,
          message: result.message ?? 'Document uploaded successfully.',
        };
      }
      return { ok: false, message: result.message ?? 'Upload failed.' };
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : 'Upload failed. Please make sure the backend is running and try again.';
      return { ok: false, message: msg };
    }
  }, [refresh]);

  const remove = useCallback(
    async (documentId: string): Promise<{ ok: boolean; message: string }> => {
      try {
        await deleteDocument(documentId);
        setDocuments((prev) => prev.filter((d) => d.id !== documentId));
        return { ok: true, message: 'Document removed from the knowledge base.' };
      } catch (err) {
        const msg =
          err instanceof ApiError
            ? err.message
            : 'Could not delete the document. Please try again.';
        return { ok: false, message: msg };
      }
    },
    [],
  );

  return { documents, loading, error, refresh, upload, remove };
}
