import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { ChatView } from '@/components/ChatView';
import { ChatComposer } from '@/components/ChatComposer';
import { UploadDialog } from '@/components/UploadDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Logo } from '@/components/Logo';
import { useTheme } from '@/hooks/useTheme';
import { useChat } from '@/hooks/useChat';
import { useDocuments } from '@/hooks/useDocuments';
import type { KnowledgeDocument } from '@/types';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { messages, isThinking, send } = useChat();
  const { documents, loading: docsLoading, error: docsError, refresh, upload, remove } = useDocuments();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<KnowledgeDocument | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleSend = (text: string) => {
    send(text);
  };

  const handleSuggestionClick = (text: string) => {
    send(text);
  };

  const handleUpload = async (file: File) => {
    return upload(file);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await remove(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar
          documents={documents}
          documentsLoading={docsLoading}
          documentsError={docsError}
          theme={theme}
          onToggleTheme={toggleTheme}
          onRefresh={refresh}
          onUploadClick={() => setUploadOpen(true)}
          onDeleteRequest={(doc) => setDeleteTarget(doc)}
        />
      </div>

      {/* Mobile sidebar drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full animate-slide-in-left">
            <Sidebar
              documents={documents}
              documentsLoading={docsLoading}
              theme={theme}
              onToggleTheme={toggleTheme}
              onRefresh={refresh}
              onUploadClick={() => {
                setMobileSidebarOpen(false);
                setUploadOpen(true);
              }}
              onDeleteRequest={(doc) => {
                setMobileSidebarOpen(false);
                setDeleteTarget(doc);
              }}
              onClose={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main chat area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden dark:border-slate-800 dark:bg-slate-900">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="rounded-md p-1.5 text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <div>
              <p className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
                MZI RAG SYSTEM
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-500">
                Enterprise Knowledge
              </p>
            </div>
          </div>
          <div className="w-9" />
        </div>

        {/* Chat messages */}
        <ChatView messages={messages} isThinking={isThinking} onSuggestionClick={handleSuggestionClick} />

        {/* Composer */}
        <ChatComposer disabled={isThinking} onSend={handleSend} />
      </div>

      {/* Dialogs */}
      <UploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onConfirm={handleUpload}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete document?"
        filename={deleteTarget?.name}
        description="This will remove this document from the knowledge base. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          if (!deleting) setDeleteTarget(null);
        }}
      />
    </div>
  );
}
