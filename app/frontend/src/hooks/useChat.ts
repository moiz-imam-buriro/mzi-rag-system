import { useCallback, useRef, useState } from 'react';
import { sendChat, ApiError } from '@/lib/api';
import { generateSessionId } from '@/lib/utils';
import type { ChatSource } from '@/types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
  error?: boolean;
  timestamp: number;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const sessionIdRef = useRef<string>(generateSessionId());
  const sendingRef = useRef(false);

  const newSession = useCallback(() => {
    sessionIdRef.current = generateSessionId();
    setMessages([]);
  }, []);

  const send = useCallback(async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || sendingRef.current) return;
    sendingRef.current = true;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const res = await sendChat({ session_id: sessionIdRef.current, question: trimmed });
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: res.answer,
        sources: res.sources,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : 'Something went wrong while processing your request. Please try again.';
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: msg,
          error: true,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsThinking(false);
      sendingRef.current = false;
    }
  }, []);

  return { messages, isThinking, send, newSession, sessionId: sessionIdRef.current };
}
