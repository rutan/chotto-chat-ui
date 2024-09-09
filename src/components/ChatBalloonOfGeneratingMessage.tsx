import type { ChatMessage } from '../libs';
import { ChatBalloon } from './ChatBalloon';
import { Spinner } from './Spinner';

export interface ChatBalloonOfGeneratingMessageProps {
  message: ChatMessage;
}

export const ChatBalloonOfGeneratingMessage = ({ message }: ChatBalloonOfGeneratingMessageProps) => {
  return (
    <ChatBalloon className="ChatBalloonOfGeneratingMessage" message={message}>
      {message.content.length === 0 && (
        <div className="py-2">
          <Spinner className="w-8 h-8 border-2 border-surface-dim border-t-primary" removeDefaultStyle />
        </div>
      )}
    </ChatBalloon>
  );
};
