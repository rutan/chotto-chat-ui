import React from 'react';
import { ChatMessage } from '../libs';
import { ChatBalloon } from './ChatBalloon';

export interface ChatBalloonOfGeneratingMessageProps {
  message: ChatMessage;
}

export const ChatBalloonOfGeneratingMessage = ({ message }: ChatBalloonOfGeneratingMessageProps) => {
  return (
    <ChatBalloon className="ChatBalloonOfGeneratingMessage" message={message}>
      {message.content.length === 0 && <div>loading...</div>}
    </ChatBalloon>
  );
};
