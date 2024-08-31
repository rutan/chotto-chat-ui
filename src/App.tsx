import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MessageHistory, useChatGenerator, useMessageHistories, useModels } from './hooks';
import { ChatForm, ChatMessageHistoryBalloon, ChatGeneratingMessageBalloon, ModelSelector } from './components';
import { Model } from './libs';

const config = { url: 'http://localhost:11434' };

export const App: React.FC = () => {
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
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const doScrollToBottom = useCallback(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, []);

  const handleModelChange = (model: Model | null) => {
    setCurrentModel(model);
  };

  const handleCancelChat = () => {
    cancelChat();
  };

  const handleSendMessage = (message: string) => {
    const userMessage = { role: 'user', content: message } as const;
    addNewMessageHistory(userMessage);
    doScrollToBottom();
  };

  const handleSendNewBranch = (history: MessageHistory, message: string) => {
    const userMessage = { role: 'user', content: message } as const;
    addBranchMessageHistory(history, userMessage);
  };

  const handleChangeBranch = (history: MessageHistory, nextId?: string) => {
    changeBranchMessageHistory(history, nextId);
  };

  useEffect(() => {
    doScrollToBottom();
  }, [generatingMessage]);

  return (
    <>
      <div className="fixed left-0 top-0 w-full h-12 bg-pane-bg shadow-md">
        <div className="max-w-3xl h-full mx-auto flex items-center">
          <ModelSelector models={models} onChange={handleModelChange} />
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
          <div className="w-full bg-pane-bg shadow-md p-2">
            <div className="max-w-3xl px-2 mx-auto">
              <ChatForm onSend={handleSendMessage} isChatting={chatLoading} onCancelChat={handleCancelChat} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
