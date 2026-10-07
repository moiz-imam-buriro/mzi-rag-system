import { AlertTriangle, FileText, Loader2 } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  filename?: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  filename,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
        onClick={loading ? undefined : onCancel}
      />
      <div className="relative z-10 w-full max-w-md animate-slide-up rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-start gap-3">
          <div
            className={
              destructive
                ? 'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10'
                : 'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600 dark:bg-accent-600/10'
            }
          >
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
            {filename && (
              <div className="mt-2 flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/40">
                <FileText size={16} className="shrink-0 text-red-500" />
                <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                  {filename}
                </span>
              </div>
            )}
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={
              destructive
                ? 'flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-40'
                : 'flex-1 flex items-center justify-center gap-2 rounded-lg bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-700 disabled:opacity-40'
            }
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
