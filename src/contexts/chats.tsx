import { type ReactNode, createContext, useCallback, useState } from 'react';
import type { Chat } from '../entities';

type RealSetChats = (chats: Chat[] | ((prev: Chat[]) => Chat[])) => void;

export const ChatsContext = createContext<{
  chats: Chat[];
  setChats: RealSetChats;
  addChat: (chat: Chat) => void;
}>({
  chats: [],
  setChats: () => {},
  addChat: () => {},
});

export const ChatsProvider = ({ children }: { children?: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);

  const addChat = useCallback((chat: Chat) => {
    setChats((prev) => [...prev, chat]);
  }, []);

  return (
    <ChatsContext.Provider
      value={{
        chats,
        setChats,
        addChat,
      }}
    >
      {children}
    </ChatsContext.Provider>
  );
};
