import { useState } from 'react';
import { Check, Copy, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage } from '@/hooks/useChat';
import { cn } from '@/lib/utils';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  // Normalize escaped HTML line breaks sometimes returned inside Markdown tables.
  // This keeps table cells readable instead of showing literal \<br> text.
  const normalizedContent = message.content
    .replace(/\\<br\s*\/?\s*>/gi, '\n')
    .replace(/<br\s*\/?\s*>/gi, '\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className={cn(
        'flex animate-slide-up gap-3',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
          isUser
            ? 'bg-accent-600 text-white'
            : message.error
              ? 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
        )}
      >
        {isUser ? (
          'You'
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4h10l6 6v10a0 0 0 0 1 0 0H4z" />
            <path d="M14 4v6h6" />
            <path d="M8 16h8" />
            <path d="M8 13h5" />
          </svg>
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          'min-w-0 max-w-[78%] overflow-hidden',
          isUser && 'flex flex-col items-end'
        )}
      >
        {!isUser && (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            MZI RAG System
          </p>
        )}

        <div
          className={cn(
            'rounded-xl px-4 py-3 text-sm leading-relaxed',
            isUser
              ? 'bg-accent-600 text-white'
              : message.error
                ? 'border border-red-200 bg-red-50 text-red-800 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-300'
                : 'border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-200'
          )}
        >
          {isUser || message.error ? (
            <p className="whitespace-pre-wrap break-words">
              {normalizedContent}
            </p>
          ) : (
            <div
              className={cn(
                'min-w-0 max-w-full break-words [overflow-wrap:anywhere]',
                '[&>p]:mb-3',
                '[&>p:last-child]:mb-0',
                '[&>h1]:mb-3 [&>h1]:mt-1 [&>h1]:text-lg [&>h1]:font-semibold',
                '[&>h2]:mb-2 [&>h2]:mt-4 [&>h2]:text-base [&>h2]:font-semibold',
                '[&>h3]:mb-2 [&>h3]:mt-3 [&>h3]:text-sm [&>h3]:font-semibold',
                '[&>ul]:mb-3 [&>ul]:ml-5 [&>ul]:list-disc [&>ul]:space-y-1',
                '[&>ol]:mb-3 [&>ol]:ml-5 [&>ol]:list-decimal [&>ol]:space-y-1',
                '[&>blockquote]:my-3 [&>blockquote]:border-l-2 [&>blockquote]:border-slate-300 [&>blockquote]:pl-3 [&>blockquote]:italic',
                '[&>hr]:my-4 [&>hr]:border-slate-200 dark:[&>hr]:border-slate-700',
                '[&_strong]:font-semibold',
                '[&_a]:font-medium [&_a]:underline',
                '[&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.85em] dark:[&_code]:bg-slate-700',
                '[&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-slate-900 [&_pre]:p-3 [&_pre]:text-xs [&_pre]:text-slate-100',
                '[&_pre_code]:bg-transparent [&_pre_code]:p-0'
              )}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({ children }) => (
                    <div className="my-3 w-full max-w-full rounded-lg border border-slate-200 dark:border-slate-700">
                      <table className="w-full table-fixed border-collapse text-xs">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="break-words whitespace-normal border-b border-slate-200 bg-slate-50 px-2 py-2 text-left font-semibold dark:border-slate-700 dark:bg-slate-800">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="break-words whitespace-normal border-b border-slate-100 px-2 py-2 align-top dark:border-slate-700/60">
                      {children}
                    </td>
                  ),
                }}
              >
                {normalizedContent}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Sources */}
        {!isUser &&
          !message.error &&
          message.sources &&
          message.sources.length > 0 && (
            <div className="mt-2.5 w-full">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Sources
              </p>

              <div className="space-y-1.5">
                {message.sources.map((src, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/30"
                  >
                    <FileText
                      size={15}
                      className="shrink-0 text-red-500"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">
                        {src.document ?? 'Source document'}
                      </p>

                      {src.page != null && (
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">
                          Page {src.page}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Copy button for AI messages */}
        {!isUser && !message.error && (
          <button
            onClick={handleCopy}
            className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-300"
          >
            {copied ? (
              <>
                <Check size={12} />
                Copied
              </>
            ) : (
              <>
                <Copy size={12} />
                Copy
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

