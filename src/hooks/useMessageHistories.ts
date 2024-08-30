import { useCallback, useMemo, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { ChatMessage } from '../libs';

export interface MessageHistory {
  id: string;
  message: ChatMessage;
  activeNextIndex?: number;
  nextIndexes: number[];
}

function seekMessageIndex(messageHistories: MessageHistory[], seekIndex: number): number[] {
  const messageHistory = messageHistories[seekIndex];
  if (!messageHistory) return [];

  const activeNextIndex = messageHistory.activeNextIndex;
  if (activeNextIndex === undefined) return [seekIndex];

  return [seekIndex, ...seekMessageIndex(messageHistories, activeNextIndex)];
}

export function useMessageHistories() {
  const [messageHistories, setMessageHistories] = useState<MessageHistory[]>([]);

  const messageIndexes = useMemo(() => {
    return seekMessageIndex(messageHistories, 0);
  }, [messageHistories]);

  const currentHistories = useMemo(() => {
    return messageIndexes.map((index) => messageHistories[index]);
  }, [messageIndexes]);

  const addMessageHistory = useCallback((message: ChatMessage) => {
    setMessageHistories((prev) => {
      const newHistories = prev.slice();
      const messageIndexes = seekMessageIndex(newHistories, 0);
      const lastIndex = messageIndexes[messageIndexes.length - 1];
      newHistories.push({
        id: uuidV4(),
        message,
        nextIndexes: [],
      });
      if (lastIndex !== undefined) {
        newHistories[lastIndex] = {
          ...newHistories[lastIndex],
          nextIndexes: [...newHistories[lastIndex].nextIndexes, newHistories.length - 1],
          activeNextIndex: newHistories.length - 1,
        };
      }

      return newHistories;
    });
  }, []);

  return {
    messageHistories,
    currentHistories,
    addMessageHistory,
  };
}
