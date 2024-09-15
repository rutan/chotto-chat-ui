import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { loadMessages, saveMessages } from '../db';
import type { Chat, Message, OllamaMessage } from '../entities';
import { postChatStream } from '../libs';
import { useAppSettings } from './useAppSettings';
import { useDatabase } from './useDatabase';

export function useMessages(chat: Chat) {
  const database = useDatabase();

  return useQuery({
    queryKey: ['messages', chat.id],
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
}

export function useMessageMutation(chat: Chat) {
  const database = useDatabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messages: Message[]) => {
      return saveMessages(database, messages);
    },
    onSuccess: (_, messages) => {
      queryClient.setQueryData(['messages', chat.id], (prev: Message[]) => {
        return [
          ...prev.filter((message) => {
            return !messages.some((newMessage) => newMessage.id === message.id);
          }),
          ...messages,
        ];
      });
    },
  });
}

export function useMessagesWithGenerator({
  chat,
  modelName,
}: {
  chat: Chat;
  modelName?: string;
}) {
  const [appSettings] = useAppSettings();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<unknown | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [generatingMessage, setGeneratingMessage] = useState<OllamaMessage | null>(null);
  const lastMessageIdRef = useRef<string>('');

  const { data = { allMessages: [], messages: [] }, isLoading, isFetching, refetch } = useMessages(chat);
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

  useEffect(() => {
    if (!modelName) return;
    if (isGenerating) return;
    if (data.messages.length <= 1) return;
    if (lastMessageIdRef.current === data.messages[data.messages.length - 1]?.id) return;

    const lastMessage = data.messages[data.messages.length - 1];
    if (lastMessage.role !== 'user') return;

    setIsGenerating(true);
    setGenerateError(null);
    lastMessageIdRef.current = lastMessage.id;

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
          modelName,
          data.messages.map((message) => ({
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
            addNewMessage(responseMessage);
            break;
          }
        }
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') {
          console.log('Request aborted');
          addNewMessage(responseMessage);
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
  }, [chat, modelName, isGenerating, data, appSettings, addNewMessage]);

  const abortGenerate = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    ...data,
    isLoading,
    isFetching,
    addNewMessage,
    addChildMessage,
    changeBranch,
    generatingMessage,
    isGenerating,
    generateError,
    abortGenerate,
    refetchMessages: refetch,
  };
}

function walkActiveMessages(messages: Message[], seekId: string): Message[] {
  const message = messages.find((message) => message.id === seekId);
  if (!message) return [];

  const nextId = message.currentNextId;
  if (nextId === undefined) return [message];

  return [message, ...walkActiveMessages(messages, nextId)];
}
