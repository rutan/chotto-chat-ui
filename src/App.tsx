import { useState } from 'react';
import { ChatBalloonList, ChatForm, Header } from './components';
import { type MessageHistory, useChatGenerator, useMessageHistories, useModels } from './hooks';
import type { Model } from './libs';

const config = { url: 'http://localhost:11434' };

export const App: React.FC = () => {
  const { models } = useModels(config);
  const [currentModel, setCurrentModel] = useState<Model | null>(null);
  const {
    systemPrompt,
    setSystemPrompt,
    currentHistories,
    addNewMessageHistory,
    addBranchMessageHistory,
    changeBranchMessageHistory,
    resetHistories,
  } = useMessageHistories();
  const {
    loading: chatLoading,
    generatingMessage,
    abort: cancelChat,
  } = useChatGenerator({
    config,
    model: currentModel?.name ?? '',
    messageHistories: currentHistories,
    addMessageHistory: addNewMessageHistory,
  });

  const handleSendMessage = (message: string) => {
    const userMessage = { role: 'user', content: message } as const;
    addNewMessageHistory(userMessage);
  };

  const handleSendNewBranch = (history: MessageHistory, message: string) => {
    const userMessage = { role: 'user', content: message } as const;
    addBranchMessageHistory(history, userMessage);
  };

  return (
    <>
      <Header
        selectedModel={currentModel}
        models={models}
        onChangeModel={setCurrentModel}
        systemPrompt={systemPrompt}
        onChangeSystemPrompt={setSystemPrompt}
        onRemoveHistory={resetHistories}
        disabled={chatLoading}
      />
      <div className="flex flex-col h-full pt-12">
        <ChatBalloonList
          currentHistories={currentHistories}
          generatingMessage={generatingMessage}
          handleSendNewBranch={handleSendNewBranch}
          changeBranchMessageHistory={changeBranchMessageHistory}
          disabled={chatLoading}
        />
        {currentModel && (
          <div className="w-full bg-surface-container shadow-md p-2">
            <div className="max-w-3xl px-2 mx-auto">
              <ChatForm onSend={handleSendMessage} isChatting={chatLoading} onCancelChat={cancelChat} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
