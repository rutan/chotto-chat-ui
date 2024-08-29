import React, { useState } from 'react';
import { useChat, useModels } from './hooks';
import { ChatForm, ModelSelector } from './components';
import { Model } from './libs';

const config = { url: 'http://localhost:11434' };

export const App: React.FC = () => {
  const { models } = useModels(config);
  const [currentModel, setCurrentModel] = useState<Model | null>(null);
  const {
    loading: chatLoading,
    messages,
    sendMessage,
    abort: cancelChat,
  } = useChat({ config, model: currentModel?.name ?? '' });

  const handleModelChange = (model: Model) => {
    setCurrentModel(model);
  };

  const handleCancelChat = () => {
    cancelChat();
  };

  return (
    <div>
      <ModelSelector models={models} onChange={handleModelChange} />
      {messages.map((message, index) => (
        <div key={index}>
          {message.role}: {message.content}
        </div>
      ))}
      {currentModel &&
        (chatLoading ? (
          <div>
            <p>Loading...</p>
            <button onClick={handleCancelChat}>Cancel</button>
          </div>
        ) : (
          <ChatForm onSend={sendMessage} />
        ))}
    </div>
  );
};
