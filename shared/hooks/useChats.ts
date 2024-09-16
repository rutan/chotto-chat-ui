import { QueryClient, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createChat, loadChats, removeChat, saveChat } from '../db';
import type { Chat, Message } from '../entities';
import { useDatabase } from './useDatabase';

const PAGE_LIMIT = 20;

export function useChats() {
  const database = useDatabase();

  const {
    data: chats = [],
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['chats'],
    queryFn: ({ pageParam: offset }) => {
      return loadChats(database, { offset, limit: PAGE_LIMIT });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_LIMIT) return undefined;
      return allPages.map((page) => page.length).reduce((a, b) => a + b, 0);
    },
    select: (data) => {
      return data.pages.flat().sort((a, b) => {
        return a.updatedAt > b.updatedAt ? -1 : 1;
      });
    },
  });

  return {
    chats,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isError,
    error,
  };
}

export function useCreateChatMutation() {
  const database = useDatabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      chat,
      messages,
    }: {
      chat: Chat;
      messages: Message[];
    }) => {
      return createChat(database, chat, messages);
    },
    onSuccess: ({ chat }) => {
      queryClient.setQueryData(
        ['chats'],
        (prev: {
          pages: Chat[][];
          pageParams: number[];
        }) => {
          return {
            pages: prev.pages.map((page) => [...page, chat]),
            pageParams: prev.pageParams,
          };
        },
      );
    },
  });
}

export function useUpdateChatMutation() {
  const database = useDatabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chat: Chat) => {
      return saveChat(database, chat);
    },
    onSuccess: (chat) => {
      queryClient.setQueryData(
        ['chats'],
        (prev: {
          pages: Chat[][];
          pageParams: number[];
        }) => {
          return {
            pages: prev.pages.map((page) => [...page.filter((c) => c.id !== chat.id), chat]),
            pageParams: prev.pageParams,
          };
        },
      );
    },
  });
}

export function useRemoveChatMutation() {
  const database = useDatabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chat: Chat) => {
      return removeChat(database, chat);
    },
    onSuccess: (_, removedChat) => {
      queryClient.setQueryData(
        ['chats'],
        (prev: {
          pages: Chat[][];
          pageParams: number[];
        }) => {
          return {
            pages: prev.pages.map((page) => page.filter((chat) => chat.id !== removedChat.id)),
            pageParams: prev.pageParams,
          };
        },
      );
    },
  });
}
