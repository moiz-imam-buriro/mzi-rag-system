import { useState } from 'react';
import { AlertTriangle, FileText, Loader2, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (file: File) => Promise<{ ok: boolean; message: string }>;
}

type Stage = 'select' | 'confirm' | 'uploading' | 'result';

export function UploadDialog({ open, onClose, onConfirm }: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<Stage>('select');
  const [resultMsg, setResultMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  if (!open) return null;

  const reset = () => {
    setFile(null);
    setStage('select');
    setResultMsg('');
    setIsDragging(false);
  };

  const handleClose = () => {
    if (stage === 'uploading') return;
    reset();
    onClose();
  };

  const handleFileSelected = (selected: File | null) => {
    if (!selected) return;
    if (!selected.name.toLowerCase().endsWith('.pdf')) {
      setResultMsg('Only PDF files are supported.');
      setStage('result');
      return;
    }
    setFile(selected);
    setStage('confirm');
  };

  const handleConfirm = async () => {
    if (!file) return;
    setStage('uploading');
    const result = await onConfirm(file);
    setResultMsg(result.message);
    setStage('result');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />
      <div className="relative z-10 w-full max-w-md animate-slide-up rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50 text-accent-600 dark:bg-accent-600/10">
              <Upload size={18} />
            </div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Upload Document
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={stage === 'uploading'}
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-40 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {stage === 'select' && (
          <div>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFileSelected(e.dataTransfer.files?.[0] ?? null);
              }}
              className={cn(
                'flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition',
                isDragging
                  ? 'border-accent-500 bg-accent-50 dark:bg-accent-600/5'
                  : 'border-slate-300 dark:border-slate-700',
              )}
            >
              <FileText size={32} className="mb-3 text-slate-400" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Drop a PDF here
              </p>
              <p className="mb-4 text-xs text-slate-500 dark:text-slate-500">or click to browse</p>
              <label className="cursor-pointer rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300">
                Select File
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={(e) => handleFileSelected(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          </div>
        )}

        {stage === 'confirm' && file && (
          <div className="animate-fade-in">
            <div className="mb-5 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10">
                <FileText size={20} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
              <div className="flex gap-2.5">
                <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                    Add to knowledge base?
                  </p>
                  <p className="mt-0.5 text-xs text-amber-800 dark:text-amber-300/80">
                    Are you sure you want to add <strong>{file.name}</strong> to the enterprise
                    knowledge base? This document will be processed and indexed.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStage('select')}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Back
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 rounded-lg bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-700"
              >
                Confirm Upload
              </button>
            </div>
          </div>
        )}

        {stage === 'uploading' && (
          <div className="flex flex-col items-center py-8 animate-fade-in">
            <Loader2 size={36} className="mb-4 animate-spin text-accent-600" />
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Processing PDF…
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
              Indexing into the knowledge base
            </p>
          </div>
        )}

        {stage === 'result' && (
          <div className="animate-fade-in">
            <div
              className={cn(
                'mb-5 flex items-center gap-3 rounded-lg border p-4',
                resultMsg.includes('success') || resultMsg.includes('successfully')
                  ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/5'
                  : 'border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/5',
              )}
            >
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                  resultMsg.includes('success') || resultMsg.includes('successfully')
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
                )}
              >
                {resultMsg.includes('success') || resultMsg.includes('successfully') ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <X size={20} />
                )}
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{resultMsg}</p>
            </div>
            <button
              onClick={handleClose}
              className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
