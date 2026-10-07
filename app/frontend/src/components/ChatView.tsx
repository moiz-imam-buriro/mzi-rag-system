import { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { ChatMessageBubble } from './ChatMessageBubble';
import type { ChatMessage } from '@/hooks/useChat';

interface ChatViewProps {
  messages: ChatMessage[];
  isThinking: boolean;
  onSuggestionClick: (text: string) => void;
}

const EXAMPLE_QUESTIONS = [
  'What is the employee leave policy?',
  'Summarize the IT security guidelines.',
  'What is the procedure for requesting time off?',
  'What are the company compliance requirements?',
];

export function ChatView({ messages, isThinking, onSuggestionClick }: ChatViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
 el.scrollTop = el.scrollHeight; }
  }, [messages, isThinking]);

  const isEmpty = messages.length === 0 && !isThinking;

  return (
    <div ref={scrollRef} className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
      {isEmpty ? (
        <div className="flex h-full flex-col items-center justify-center px-6 py-12">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-50 text-accent-600 dark:bg-accent-600/10">
            <Sparkles size={28} />
          </div>
          <h1 className="text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Enterprise Knowledge Intelligence
          </h1>
          <p className="mt-2 max-w-md text-center text-sm text-slate-500 dark:text-slate-400">
            Ask questions about your company's internal knowledge base. Answers are grounded in
            your uploaded documents.
          </p>
          <div className="mt-8 grid w-full max-w-lg grid-cols-1 gap-2.5 sm:grid-cols-2">
            {EXAMPLE_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => onSuggestionClick(q)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 transition hover:border-accent-300 hover:bg-accent-50/50 dark:border-slate-800 dark:bg-slate-800/30 dark:text-slate-300 dark:hover:border-accent-500/30 dark:hover:bg-accent-600/5"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mx-auto w-full min-w-0 max-w-3xl space-y-6 px-4 py-6">
          {messages.map((msg) => (
            <ChatMessageBubble key={msg.id} message={msg} />
          ))}
          {isThinking && (
            <div className="flex animate-fade-in gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h10l6 6v10a0 0 0 0 1 0 0H4z" />
                  <path d="M14 4v6h6" />
                  <path d="M8 16h8" />
                  <path d="M8 13h5" />
                </svg>
              </div>
              <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  MZI RAG System
                </p>
                <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                  <span className="thinking-dot" style={{ animationDelay: '0s' }} />
                  <span className="thinking-dot" style={{ animationDelay: '0.15s' }} />
                  <span className="thinking-dot" style={{ animationDelay: '0.3s' }} />
                  <span className="ml-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    Thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
