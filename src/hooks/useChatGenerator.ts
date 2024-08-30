import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ApiConfig, ChatMessage, postChatStream } from '../libs';
import { MessageHistory } from './useMessageHistories';

export function useChatGenerator({
  config,
  model,
  messageHistories,
  addMessageHistory,
}: {
  config: ApiConfig;
  model: string;
  messageHistories: MessageHistory[];
  addMessageHistory: (message: ChatMessage) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [generatingMessage, setGeneratingMessage] = useState<ChatMessage | null>(null);

  const messages = useMemo(() => {
    return messageHistories.map((history) => history.message);
  }, [messageHistories]);

  useEffect(() => {
    if (!model) return;
    if (loading) return;
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'user') return;

    setLoading(true);
    setError(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    (async () => {
      try {
        const reader = await postChatStream(config, model, messages, {
          signal: controller.signal,
        });
        const decoder = new TextDecoder();
        const responseMessage = { role: 'assistant' as const, content: '' };

        while (true) {
          const { done, value } = await reader.read();
          if (value) {
            const text = decoder.decode(value);
            const data = JSON.parse(text);
            responseMessage.content = `${responseMessage.content}${data.message.content}`;
            setGeneratingMessage({ ...responseMessage });
          }

          if (done) {
            setLoading(false);
            addMessageHistory(responseMessage);
            break;
          }
        }
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') {
          console.log('Request aborted');
          return;
        }
        console.error(e);
        setError(e);
      } finally {
        abortControllerRef.current = null;
        setLoading(false);
        setGeneratingMessage(null);
      }
    })();
  }, [config, model, messages]);

  const abort = useCallback(() => {
    console.log(abortControllerRef.current);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    loading,
    error,
    generatingMessage,
    abort,
  };
}
