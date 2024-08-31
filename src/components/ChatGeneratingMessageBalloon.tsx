import React from 'react';
import { ChatMessage } from '../libs';
import { ChatMessageBody } from './ChatMessageBody';

export interface ChatGeneratingMessageBalloonProps {
  message: ChatMessage;
}

export const ChatGeneratingMessageBalloon = ({ message }: ChatGeneratingMessageBalloonProps) => {
  return <ChatMessageBody message={message}></ChatMessageBody>;
};
