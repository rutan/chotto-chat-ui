import { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { type ChatMessage, nonNullableFilter } from '../libs';

export interface MessageHistory {
  id: string;
  message: ChatMessage;
  activeNextId?: string;
  nextIds: string[];
}

function seekMessageIds(messageHistories: MessageHistory[], seedId: string): string[] {
  const messageHistory = messageHistories.find((history) => history.id === seedId);
  if (!messageHistory) return [];

  const activeNextIndex = messageHistory.activeNextId;
  if (activeNextIndex === undefined) return [seedId];

  return [seedId, ...seekMessageIds(messageHistories, activeNextIndex)];
}

export function useMessageHistories() {
  const [systemPrompt, setSystemPrompt] = useState('You are Assistant bot.');
  const [messageHistories, setMessageHistories] = useState<MessageHistory[]>([
    {
      id: uuidV4(),
      message: { role: 'system', content: systemPrompt },
      nextIds: [],
    },
  ]);

  const messageIds = useMemo(() => {
    return seekMessageIds(messageHistories, messageHistories[0]?.id ?? '');
  }, [messageHistories]);

  const currentHistories = useMemo(() => {
    return messageIds.map((id) => messageHistories.find((history) => history.id === id)).filter(nonNullableFilter);
  }, [messageIds, messageHistories]);

  const addNewMessageHistory = useCallback((message: ChatMessage) => {
    setMessageHistories((prev) => {
      const newHistories = prev.slice();
      if (newHistories.length === 0) throw new Error('System message not found');

      const messageIds = seekMessageIds(newHistories, newHistories[0].id);
      const lastMessageId = messageIds[messageIds.length - 1];
      const lastMessageIndex = newHistories.findIndex((history) => history.id === lastMessageId);

      const newHistory = {
        id: uuidV4(),
        message,
        nextIds: [],
      };
      newHistories.push(newHistory);

      if (lastMessageIndex !== -1) {
        newHistories[lastMessageIndex] = {
          ...newHistories[lastMessageIndex],
          activeNextId: newHistory.id,
          nextIds: [...newHistories[lastMessageIndex].nextIds, newHistory.id],
        };
      }

      return newHistories;
    });
  }, []);

  const addBranchMessageHistory = useCallback((targetHistory: MessageHistory, message: ChatMessage) => {
    setMessageHistories((prev) => {
      const newHistories = prev.slice();
      const targetIndex = newHistories.findIndex((history) => history.id === targetHistory.id);
      if (targetIndex === -1) throw new Error('Invalid target history');

      const newHistory = {
        id: uuidV4(),
        message,
        nextIds: [],
      };
      newHistories.push(newHistory);

      newHistories[targetIndex] = {
        ...newHistories[targetIndex],
        activeNextId: newHistory.id,
        nextIds: [...newHistories[targetIndex].nextIds, newHistory.id],
      };

      return newHistories;
    });
  }, []);

  const changeBranchMessageHistory = useCallback((targetHistory: MessageHistory, newNextId?: string) => {
    if (newNextId && !targetHistory.nextIds.includes(newNextId)) throw new Error('Invalid nextId');

    setMessageHistories((prev) => {
      const newHistories = prev.slice();
      const targetIndex = newHistories.findIndex((history) => history.id === targetHistory.id);
      if (targetIndex === -1) throw new Error('Invalid target history');

      newHistories[targetIndex] = {
        ...newHistories[targetIndex],
        activeNextId: newNextId,
      };

      return newHistories;
    });
  }, []);

  const resetHistories = useCallback(() => {
    setMessageHistories([
      {
        id: uuidV4(),
        message: { role: 'system', content: systemPrompt },
        nextIds: [],
      },
    ]);
  }, [systemPrompt]);

  useEffect(() => {
    setMessageHistories((prev) => {
      const systemMessage = prev.find((history) => history.message.role === 'system');
      if (!systemMessage) throw new Error('System message not found');

      return [
        {
          ...systemMessage,
          message: { role: 'system', content: systemPrompt },
        },
        ...prev.filter((history) => history.message.role !== 'system'),
      ];
    });
  }, [systemPrompt]);

  return {
    systemPrompt,
    setSystemPrompt,
    messageHistories,
    currentHistories,
    addNewMessageHistory,
    addBranchMessageHistory,
    changeBranchMessageHistory,
    resetHistories,
  };
}
