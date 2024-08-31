import React from 'react';
import { MessageHistory } from '../hooks';
import { ChatMessageBody } from './ChatMessageBody';

export interface ChatMessageHistoryBalloonProps {
  messageHistory: MessageHistory;
}

export const ChatMessageHistoryBalloon = ({ messageHistory }: ChatMessageHistoryBalloonProps) => {
  return <ChatMessageBody message={messageHistory.message}></ChatMessageBody>;
};
