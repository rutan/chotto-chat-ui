import { useCallback, useState } from 'react';
import { type Chat, type Message, type OllamaMessage, type OllamaModel, initMessage, isNewChat } from '../entities';
import {
  useCreateChatMutation,
  useMessageGenerator,
  useMessages,
  useRemoveChatMutation,
  useUpdateChatMutation,
} from '../hooks';
import { ChatBalloonList } from './ChatBalloonList';
import { ChatForm } from './ChatForm';
import { Header } from './Header';

export interface ChatPanelProps {
  className?: string;
  chat: Chat;
  onChangeChat: (chat: Chat | null) => void;
  onClickToggleSideMenu: () => void;
}

export const ChatPanel = ({ className, chat, onChangeChat, onClickToggleSideMenu }: ChatPanelProps) => {
  const [currentModel, setCurrentModel] = useState<OllamaModel | null>(null);
  const createChatMutation = useCreateChatMutation();
  const updateChatMutation = useUpdateChatMutation();
  const removeChatMutation = useRemoveChatMutation();
  const [isAllowGenerate, setIsAllowGenerate] = useState(false);

  const { messages, addNewMessage, changeBranch, addChildMessage, refetch: refetchMessages } = useMessages(chat);

  const handleGenerateComplete = useCallback(
    (message: OllamaMessage) => {
      setIsAllowGenerate(false);
      addNewMessage(message);
    },
    [addNewMessage],
  );

  const {
    isGenerating,
    generatingMessage,
    abort: cancelChat,
  } = useMessageGenerator({
    chat,
    messages,
    onGenerateComplete: handleGenerateComplete,
    enabled: isAllowGenerate,
  });

  const [isBusy, setIsBusy] = useState(false);

  const handleChangeModel = useCallback(
    (model: OllamaModel | null) => {
      setCurrentModel(model);
      if (!model || chat.modelName === model.name) return;

      handleUpdateChat({
        ...chat,
        modelName: model.name,
      });
    },
    [chat],
  );

  const handleRegisterChat = useCallback(
    async (message: OllamaMessage) => {
      if (!currentModel) return;
      if (isBusy) return;

      setIsBusy(true);

      const newChatData = {
        ...chat,
        modelName: currentModel.name,
        title: chat.title || message.content.split('\n')[0].trim(),
      };
      const systemPromptMessage = initMessage({
        chatId: newChatData.id,
        role: 'system',
        content: '',
      });
      const userMessage = initMessage({
        chatId: newChatData.id,
        ...message,
        previousId: systemPromptMessage.id,
      });
      systemPromptMessage.nextIds.push(userMessage.id);
      systemPromptMessage.currentNextId = userMessage.id;

      createChatMutation.mutateAsync(
        { chat: newChatData, messages: [systemPromptMessage, userMessage] },
        {
          onSuccess: ({ chat }) => {
            onChangeChat(chat);
            refetchMessages();
            setIsBusy(false);
          },
        },
      );
    },
    [isBusy, chat, createChatMutation, onChangeChat, currentModel, refetchMessages],
  );

  const handleSendMessage = useCallback(
    async (message: string) => {
      const userMessage = { role: 'user', content: message } as const;

      if (isNewChat(chat)) {
        await handleRegisterChat(userMessage);
      } else {
        await addNewMessage(userMessage);
      }

      setIsAllowGenerate(true);
    },
    [chat, addNewMessage, handleRegisterChat],
  );

  const handleAddChildMessage = useCallback(
    async (targetMessage: Message, child: OllamaMessage) => {
      await addChildMessage(targetMessage, child);
      if (child.role === 'user') setIsAllowGenerate(true);
    },
    [addChildMessage],
  );

  const handleChangeBranch = useCallback(
    async (targetMessage: Message, newNextId: string) => {
      await changeBranch(targetMessage, newNextId);
    },
    [changeBranch],
  );

  const handleUpdateChat = useCallback(
    (chat: Chat) => {
      if (isNewChat(chat)) {
        onChangeChat(chat);
        return;
      }

      updateChatMutation.mutateAsync(chat, {
        onSuccess: (updatedChat) => {
          onChangeChat(updatedChat);
        },
      });
    },
    [onChangeChat, updateChatMutation],
  );

  const handleRemoveChat = useCallback(() => {
    removeChatMutation.mutateAsync(chat);
    onChangeChat(null);
  }, [chat, onChangeChat, removeChatMutation]);

  return (
    <div className={className}>
      <Header
        className="shrink-0"
        chat={chat}
        selectedModel={currentModel}
        onChangeModel={handleChangeModel}
        onUpdateChat={handleUpdateChat}
        onRemoveChat={handleRemoveChat}
        onToggleSideMenu={onClickToggleSideMenu}
        disabled={isGenerating}
      />
      <ChatBalloonList
        messages={messages}
        generatingMessage={generatingMessage}
        onAddChildMessage={handleAddChildMessage}
        onChangeBranch={handleChangeBranch}
        disabled={isGenerating}
      />
      {currentModel && (
        <div className="w-full bg-surface p-2 shrink-0">
          <div className="max-w-3xl px-2 mx-auto">
            <ChatForm onSend={handleSendMessage} isChatting={isGenerating} onCancelChat={cancelChat} />
          </div>
        </div>
      )}
    </div>
  );
};
