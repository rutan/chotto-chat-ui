import { useCallback, useState } from 'react';
import { type Chat, type OllamaMessage, type OllamaModel, initChat, initMessage } from '../entities';
import { useCreateChatMutation, useRemoveChatMutation } from '../hooks';
import { useMessagesWithGenerator } from '../hooks';
import { ChatBalloonList } from './ChatBalloonList';
import { ChatForm } from './ChatForm';
import { Header } from './Header';

export interface ChatPanelProps {
  className?: string;
  chat?: Chat | null;
  onChangeChat: (chat: Chat | null) => void;
  onClickToggleSideMenu: () => void;
}

export const ChatPanel = ({ className, chat, onChangeChat, onClickToggleSideMenu }: ChatPanelProps) => {
  const [currentModel, setCurrentModel] = useState<OllamaModel | null>(null);
  const createChatMutation = useCreateChatMutation();
  const removeChatMutation = useRemoveChatMutation();

  const {
    messages,
    addNewMessage,
    changeBranch,
    addChildMessage,
    isGenerating,
    generatingMessage,
    abortGenerate: cancelChat,
  } = useMessagesWithGenerator({
    chatId: chat?.id,
    modelName: currentModel?.name ?? '',
  });
  const [isBusy, setIsBusy] = useState(false);

  const handleRegisterChat = useCallback(
    async (message: OllamaMessage) => {
      if (!currentModel) return;
      if (isBusy) return;

      setIsBusy(true);

      const newChatData = initChat({
        modelName: currentModel.name,
      });
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
            setIsBusy(false);
          },
        },
      );
    },
    [isBusy, createChatMutation, onChangeChat, currentModel],
  );

  const handleSendMessage = useCallback(
    async (message: string) => {
      const userMessage = { role: 'user', content: message } as const;

      if (chat) {
        addNewMessage(userMessage);
      } else {
        await handleRegisterChat(userMessage);
      }
    },
    [chat, addNewMessage, handleRegisterChat],
  );

  const handleRemoveChat = useCallback(() => {
    if (!chat) return;

    removeChatMutation.mutateAsync(chat);
    onChangeChat(null);
  }, [chat, onChangeChat, removeChatMutation]);

  return (
    <div className={className}>
      <Header
        className="shrink-0"
        chat={chat}
        selectedModel={currentModel}
        onChangeModel={setCurrentModel}
        onRemoveChat={handleRemoveChat}
        onToggleSideMenu={onClickToggleSideMenu}
        disabled={isGenerating}
      />
      <ChatBalloonList
        messages={messages}
        generatingMessage={generatingMessage}
        onAddChildMessage={addChildMessage}
        onChangeBranch={changeBranch}
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
