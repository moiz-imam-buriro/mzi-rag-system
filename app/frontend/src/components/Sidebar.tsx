import { FileText, Loader2, Trash2, Upload, Moon, Sun, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Logo } from './Logo';
import { cn, formatRelativeTime } from '@/lib/utils';
import type { KnowledgeDocument, Theme } from '@/types';

interface SidebarProps {
  documents: KnowledgeDocument[];
  documentsLoading: boolean;
  documentsError?: string | null;
  theme: Theme;
  onToggleTheme: () => void;
  onRefresh: () => void;
  onUploadClick: () => void;
  onDeleteRequest: (doc: KnowledgeDocument) => void;
  onClose?: () => void;
}

export function Sidebar({
  documents,
  documentsLoading,
  documentsError,
  theme,
  onToggleTheme,
  onRefresh,
  onUploadClick,
  onDeleteRequest,
  onClose,
}: SidebarProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    onRefresh();
    setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <div className="flex h-full w-72 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* Brand */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center gap-2.5 min-w-0">
          <Logo size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
              MZI RAG SYSTEM
            </p>
            <p className="truncate text-[11px] text-slate-500 dark:text-slate-500">
              Enterprise Knowledge
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 lg:hidden dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label="Close sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Upload button */}
      <div className="px-4 pt-4">
        <button
          onClick={onUploadClick}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-700 active:scale-[0.98]"
        >
          <Upload size={16} />
          Upload PDF
        </button>
      </div>

      {/* Knowledge base list */}
      <div className="mt-5 flex-1 overflow-y-auto px-3">
        <div className="mb-2 flex items-center justify-between px-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Knowledge Base
          </p>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-600">
            {documents.length}
          </span>
        </div>

        {documentsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={20} className="animate-spin text-slate-400" />
          </div>
        ) : documentsError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-3 dark:border-red-500/20 dark:bg-red-500/5">
            <p className="text-xs leading-relaxed text-red-700 dark:text-red-300">{documentsError}</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 px-3 py-6 text-center dark:border-slate-800">
            <FileText size={20} className="mx-auto mb-2 text-slate-300 dark:text-slate-700" />
            <p className="text-xs text-slate-500 dark:text-slate-500">
              No documents yet
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-600 dark:bg-red-500/10">
                  <FileText size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                    {doc.name}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-600">
                    {doc.pages ? `${doc.pages} pages` : 'PDF'}
                    {doc.uploadedAt ? ` · ${formatRelativeTime(doc.uploadedAt)}` : ''}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteRequest(doc)}
                  className="shrink-0 rounded-md p-1 text-slate-300 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:text-slate-600 dark:hover:bg-red-500/10"
                  aria-label={`Delete ${doc.name}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer: controls + branding */}
      <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="mb-3 flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <button
            onClick={handleRefresh}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <RefreshCw size={14} className={cn(refreshing && 'animate-spin')} />
            Refresh
          </button>
        </div>
        <div className="rounded-lg bg-slate-50 px-3 py-2.5 dark:bg-slate-800/40">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Powered & Made by
          </p>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Moiz Imam
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">AI Engineer</p>
        </div>
      </div>
    </div>
  );
}
