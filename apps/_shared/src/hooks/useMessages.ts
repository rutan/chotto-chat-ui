import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { loadMessages, saveMessages } from '../db';
import type { Chat, Message, OllamaMessage } from '../entities';
import { postChatStream } from '../libs';
import { useAppSettings } from './useAppSettings';
import { useDatabase } from './useDatabase';

function generateMessageQueryKey(chat: Chat) {
  return ['messages', chat.id];
}

function walkActiveMessages(messages: Message[], seekId: string): Message[] {
  const message = messages.find((message) => message.id === seekId);
  if (!message) return [];

  const nextId = message.currentNextId;
  if (nextId === undefined) return [message];

  return [message, ...walkActiveMessages(messages, nextId)];
}

export function useMessages(chat: Chat) {
  const database = useDatabase();

  const { data = { allMessages: [], messages: [] }, ...rest } = useQuery({
    queryKey: generateMessageQueryKey(chat),
    queryFn: () => {
      return loadMessages(database, chat.id);
    },
    select: (data: Message[]) => {
      const systemMessage = data.find((message) => message.role === 'system');
      if (!systemMessage)
        return {
          allMessages: data,
          messages: [],
        };

      return {
        allMessages: data,
        messages: walkActiveMessages(data, systemMessage.id),
      };
    },
  });

  const updateMessagesMutation = useMessageMutation(chat);

  const addChildMessage = useCallback(
    async (targetMessage: Message, { role, content }: { role: Message['role']; content: Message['content'] }) => {
      if (!data.allMessages.some((message) => message.id === targetMessage.id))
        throw new Error('targetMessage not found');

      const newMessage = {
        id: uuidV4(),
        chatId: chat.id,
        role,
        content,
        previousId: targetMessage.id,
        currentNextId: undefined,
        nextIds: [],
      };
      targetMessage.currentNextId = newMessage.id;
      targetMessage.nextIds.push(newMessage.id);

      updateMessagesMutation.mutate([targetMessage, newMessage]);
    },
    [chat, data, updateMessagesMutation],
  );

  const addNewMessage = useCallback(
    async ({ role, content }: { role: Message['role']; content: Message['content'] }) => {
      const lastMessage = data.messages[data.messages.length - 1];
      if (!lastMessage) throw new Error('System message not found');

      return addChildMessage(lastMessage, { role, content });
    },
    [data, addChildMessage],
  );

  const changeBranch = useCallback(
    async (targetMessage: Message, newNextId: string) => {
      if (!data.allMessages.some((message) => message.id === targetMessage.id))
        throw new Error('targetMessage not found');

      targetMessage.currentNextId = newNextId;
      updateMessagesMutation.mutate([targetMessage]);
    },
    [data, updateMessagesMutation],
  );

  return {
    allMessages: data.allMessages,
    messages: data.messages,
    ...rest,
    addNewMessage,
    addChildMessage,
    changeBranch,
  };
}

export function useMessageGenerator({
  chat,
  messages,
  onGenerateComplete,
  enabled = true,
}: {
  chat: Chat;
  messages: Message[];
  onGenerateComplete?: (message: OllamaMessage) => void;
  enabled?: boolean;
}) {
  const [appSettings] = useAppSettings();
  const [generatingMessage, setGeneratingMessage] = useState<OllamaMessage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<unknown | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (isGenerating) return;
    if (messages.length < 2) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'user') return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsGenerating(true);

    const responseMessage = { role: 'assistant' as const, content: '' };
    setGeneratingMessage({ ...responseMessage });

    (async () => {
      try {
        const reader = await postChatStream(
          {
            url: appSettings.apiEndpoint,
          },
          chat.modelName,
          messages.map((message) => ({
            role: message.role,
            content: message.role === 'system' ? chat.systemPrompt || appSettings.defaultSystemPrompt : message.content,
          })),
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
            onGenerateComplete?.(responseMessage);
            break;
          }
        }
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') {
          onGenerateComplete?.(responseMessage);
          return;
        }
        console.error(e);
        setGenerateError(e);
      } finally {
        abortControllerRef.current = null;
        setIsGenerating(false);
        setGeneratingMessage(null);
      }
    })();
  }, [enabled, appSettings, chat, messages, isGenerating, onGenerateComplete]);

  return {
    generatingMessage,
    isGenerating,
    generateError,
    abort,
  };
}

export function useMessageMutation(chat: Chat) {
  const database = useDatabase();
  const queryClient = useQueryClient();

  const applyMessageToCache = useCallback(
    (messages: Message[]) => {
      queryClient.setQueryData(generateMessageQueryKey(chat), (prev: Message[]) => {
        return [
          ...prev.filter((message) => {
            return !messages.some((newMessage) => newMessage.id === message.id);
          }),
          ...messages,
        ];
      });
    },
    [queryClient, chat],
  );

  return useMutation({
    mutationFn: (messages: Message[]) => {
      return saveMessages(database, messages);
    },
    onMutate: async (messages) => {
      const queryKey = generateMessageQueryKey(chat);
      await queryClient.cancelQueries({ queryKey });
      const prevData = queryClient.getQueryData(queryKey);
      applyMessageToCache(messages);

      return { prevData };
    },
    onSuccess: (_, messages) => {
      applyMessageToCache(messages);
    },
    onError: (_, __, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(generateMessageQueryKey(chat), context.prevData);
      }
    },
  });
}
