import { useCallback, useEffect, useRef } from 'react';
import type { MessageHistory } from '../hooks';
import { type ChatMessage, cx } from '../libs';
import { ChatBalloonOfGeneratingMessage } from './ChatBalloonOfGeneratingMessage';
import { ChatBalloonOfMessageHistory } from './ChatBalloonOfMessageHistory';

export interface ChatBalloonListProps {
  className?: string;
  currentHistories: MessageHistory[];
  generatingMessage: ChatMessage | null;
  handleSendNewBranch: (history: MessageHistory, message: string) => void;
  changeBranchMessageHistory: (targetHistory: MessageHistory, newNextId?: string) => void;
  disabled: boolean;
}

export const ChatBalloonList = ({
  className,
  currentHistories,
  generatingMessage,
  handleSendNewBranch,
  changeBranchMessageHistory,
  disabled,
}: ChatBalloonListProps) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const doScrollToBottom = useCallback(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    doScrollToBottom();
  }, [doScrollToBottom]);

  return (
    <div className={cx('ChatList', 'grow overflow-y-scroll', className)} ref={chatContainerRef}>
      <div className="max-w-3xl mx-auto my-8 px-2 flex flex-col gap-4">
        {currentHistories.map((history, index) => (
          <ChatBalloonOfMessageHistory
            key={history.id}
            messageHistory={history}
            parentMessageHistory={currentHistories[index - 1]}
            onSendNewBranch={handleSendNewBranch}
            onChangeBranch={changeBranchMessageHistory}
            disabled={disabled}
          />
        ))}
        {generatingMessage && <ChatBalloonOfGeneratingMessage message={generatingMessage} />}
      </div>
    </div>
  );
};
