import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type ChatMessage, postChatStream } from '../libs';
import { useAppSettings } from './useAppSettings';
import type { MessageHistory } from './useMessageHistories';

export function useChatGenerator({
  model,
  messageHistories,
  addMessageHistory,
}: {
  model: string;
  messageHistories: MessageHistory[];
  addMessageHistory: (message: ChatMessage) => void;
}) {
  const [appSettings] = useAppSettings();
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
      const responseMessage = { role: 'assistant' as const, content: '' };
      setGeneratingMessage({ ...responseMessage });

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const reader = await postChatStream(
          {
            url: appSettings.apiEndpoint,
          },
          model,
          messages,
          {
            signal: controller.signal,
          },
        );
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (value) {
            const text = decoder.decode(value);
            const lines = text.split('\n');
            for (const line of lines) {
              if (!line) continue;
              const data = JSON.parse(line);
              responseMessage.content = `${responseMessage.content}${data.message.content}`;
              setGeneratingMessage({ ...responseMessage });
            }
          }

          if (done) {
            addMessageHistory(responseMessage);
            break;
          }
        }
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') {
          console.log('Request aborted');
          addMessageHistory(responseMessage);
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
  }, [loading, appSettings, model, messages, addMessageHistory]);

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
