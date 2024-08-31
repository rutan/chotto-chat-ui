import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MessageHistory, useChatGenerator, useDarkMode, useMessageHistories, useModels } from './hooks';
import { ChatForm, ChatMessageHistoryBalloon, ChatGeneratingMessageBalloon, ModelSelector } from './components';
import { Model } from './libs';
import { MdLightMode, MdDarkMode } from 'react-icons/md';

const config = { url: 'http://localhost:11434' };

export const App: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { models } = useModels(config);
  const [currentModel, setCurrentModel] = useState<Model | null>(null);
  const { currentHistories, addNewMessageHistory, addBranchMessageHistory, changeBranchMessageHistory } =
    useMessageHistories();
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
  const [isReservedScroll, setIsReservedScroll] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const doScrollToBottom = useCallback(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, []);

  const handleSwitchDarkMode = useCallback(() => {
    toggleDarkMode();
  }, [toggleDarkMode]);

  const handleModelChange = (model: Model | null) => {
    setCurrentModel(model);
  };

  const handleCancelChat = () => {
    cancelChat();
  };

  const handleSendMessage = (message: string) => {
    const userMessage = { role: 'user', content: message } as const;
    addNewMessageHistory(userMessage);
    setIsReservedScroll(true);
  };

  const handleSendNewBranch = (history: MessageHistory, message: string) => {
    const userMessage = { role: 'user', content: message } as const;
    addBranchMessageHistory(history, userMessage);
  };

  const handleChangeBranch = (history: MessageHistory, nextId?: string) => {
    changeBranchMessageHistory(history, nextId);
  };

  useEffect(() => {
    if (!isReservedScroll) return;

    doScrollToBottom();
    setIsReservedScroll(false);
  }, [currentHistories, isReservedScroll]);

  useEffect(() => {
    doScrollToBottom();
  }, [generatingMessage]);

  return (
    <>
      <div className="fixed left-0 top-0 w-full h-12 bg-surface-container shadow-md">
        <div className="max-w-3xl h-full mx-auto flex items-center justify-between">
          <ModelSelector models={models} onChange={handleModelChange} disabled={chatLoading} />
          <button
            className="flex items-center justify-center w-10 h-10 bg-tertiary text-on-primary rounded hover:opacity-80"
            onClick={handleSwitchDarkMode}
          >
            {isDarkMode ? (
              <MdDarkMode className="w-6 h-6" title="Change to light mode" />
            ) : (
              <MdLightMode className="w-6 h-6" title="Change to dark mode" />
            )}
          </button>
        </div>
      </div>
      <div className="flex flex-col h-full pt-12">
        <div className="grow overflow-y-scroll" ref={chatContainerRef}>
          <div className="max-w-3xl mx-auto my-8 px-2 flex flex-col gap-4">
            {currentHistories.map((history, index) => (
              <ChatMessageHistoryBalloon
                key={index}
                messageHistory={history}
                parentMessageHistory={currentHistories[index - 1]}
                onSendNewBranch={handleSendNewBranch}
                onChangeBranch={handleChangeBranch}
                disabled={chatLoading}
              />
            ))}
            {generatingMessage && <ChatGeneratingMessageBalloon message={generatingMessage} />}
          </div>
        </div>
        {currentModel && (
          <div className="w-full bg-surface-container shadow-md p-2">
            <div className="max-w-3xl px-2 mx-auto">
              <ChatForm onSend={handleSendMessage} isChatting={chatLoading} onCancelChat={handleCancelChat} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
