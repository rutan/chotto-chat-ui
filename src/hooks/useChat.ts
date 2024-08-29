import { useCallback, useRef, useState } from 'react';
import { ApiConfig, ChatMessage, postChatStream } from '../libs';

export function useChat({ config, model }: { config: ApiConfig; model: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (message: string) => {
      setLoading(true);
      setError(null);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setMessages((prev) => {
        const newMessages = [...prev, { role: 'user', content: message } as const];

        (async () => {
          try {
            const reader = await postChatStream(config, model, newMessages, {
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
                setMessages([...newMessages, { ...responseMessage }]);
              }

              if (done) {
                setLoading(false);
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
          }
        })();

        return newMessages;
      });
    },
    [config, model],
  );

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
    messages,
    sendMessage,
    abort,
  };
}
