import React, { useState } from 'react';
import { useChatGenerator, useMessageHistories, useModels } from './hooks';
import { ChatForm, ModelSelector } from './components';
import { Model } from './libs';

const config = { url: 'http://localhost:11434' };

export const App: React.FC = () => {
  const { models } = useModels(config);
  const [currentModel, setCurrentModel] = useState<Model | null>(null);
  const { currentHistories, addMessageHistory } = useMessageHistories();
  const {
    loading: chatLoading,
    generatingMessage,
    abort: cancelChat,
  } = useChatGenerator({
    config,
    model: currentModel?.name ?? '',
    messageHistories: currentHistories,
    addMessageHistory,
  });

  const handleModelChange = (model: Model) => {
    setCurrentModel(model);
  };

  const handleCancelChat = () => {
    cancelChat();
  };

  const handleSendMessage = (message: string) => {
    const userMessage = { role: 'user', content: message } as const;
    addMessageHistory(userMessage);
  };

  return (
    <div>
      <ModelSelector models={models} onChange={handleModelChange} />
      {currentHistories.map((history, index) => (
        <div key={index}>
          {history.message.role}: {history.message.content}
        </div>
      ))}
      {generatingMessage && (
        <div>
          {generatingMessage.role}: {generatingMessage.content}
        </div>
      )}
      {currentModel &&
        (chatLoading ? (
          <div>
            <p>Loading...</p>
            <button onClick={handleCancelChat}>Cancel</button>
          </div>
        ) : (
          <ChatForm onSend={handleSendMessage} />
        ))}
    </div>
  );
};
