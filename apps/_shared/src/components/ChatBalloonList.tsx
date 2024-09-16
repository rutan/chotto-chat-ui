import { useCallback, useEffect, useRef } from 'react';
import type { Message, OllamaMessage } from '../entities';
import { cx } from '../libs';
import { ChatBalloonOfGeneratingMessage } from './ChatBalloonOfGeneratingMessage';
import { ChatBalloonOfMessageHistory } from './ChatBalloonOfMessageHistory';

export interface ChatBalloonListProps {
  className?: string;
  messages: Message[];
  generatingMessage: OllamaMessage | null;
  onAddChildMessage: (targetMessage: Message, child: OllamaMessage) => void;
  onChangeBranch: (targetMessage: Message, nextId: string) => void;
  disabled: boolean;
}

export const ChatBalloonList = ({
  className,
  messages,
  generatingMessage,
  onAddChildMessage,
  onChangeBranch,
  disabled,
}: ChatBalloonListProps) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const doScrollToBottom = useCallback(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies(generatingMessage): scroll to bottom when generating message
  useEffect(() => {
    doScrollToBottom();
  }, [doScrollToBottom, generatingMessage]);

  return (
    <div className={cx('ChatList', 'grow overflow-y-scroll', className)} ref={chatContainerRef}>
      <div className="max-w-3xl mx-auto my-8 px-2 flex flex-col gap-4">
        {messages.map((message, index) => (
          <ChatBalloonOfMessageHistory
            key={message.id}
            message={message}
            parentMessage={messages[index - 1]}
            onAddChildMessage={onAddChildMessage}
            onChangeBranch={onChangeBranch}
            disabled={disabled}
          />
        ))}
        {generatingMessage && <ChatBalloonOfGeneratingMessage message={generatingMessage} />}
      </div>
    </div>
  );
};
