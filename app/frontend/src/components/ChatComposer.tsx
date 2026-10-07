import { useEffect, useRef, useState } from 'react';
import { ArrowUp, CornerDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatComposerProps {
  disabled: boolean;
  onSend: (text: string) => void;
}

export function ChatComposer({ disabled, onSend }: ChatComposerProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-3xl">
        <div
          className={cn(
            'flex items-end gap-2 rounded-xl border bg-slate-50 px-3 py-2.5 transition dark:bg-slate-800/40',
            disabled
              ? 'border-slate-200 opacity-60 dark:border-slate-800'
              : 'border-slate-200 focus-within:border-accent-400 dark:border-slate-700 dark:focus-within:border-accent-500',
          )}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={1}
            placeholder="Ask about your enterprise knowledge..."
            className="flex-1 resize-none bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none disabled:cursor-not-allowed dark:text-slate-200 dark:placeholder-slate-500"
          />
          <button
            onClick={handleSubmit}
            disabled={!canSend}
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition active:scale-95',
              canSend
                ? 'bg-accent-600 text-white hover:bg-accent-700'
                : 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500',
            )}
            aria-label="Send message"
          >
            <ArrowUp size={18} />
          </button>
        </div>
        <p className="mt-1.5 flex items-center justify-center gap-1 text-[10px] text-slate-400 dark:text-slate-600">
          <CornerDownLeft size={10} /> Enter to send · Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
