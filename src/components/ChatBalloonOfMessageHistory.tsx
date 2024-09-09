import { useCallback, useMemo, useRef, useState } from 'react';
import { MdChevronLeft, MdChevronRight, MdEdit } from 'react-icons/md';
import type { MessageHistory } from '../hooks';
import { isElementInViewport } from '../libs';
import { ChatBalloon } from './ChatBalloon';
import { ChatEditForm } from './ChatEditForm';

export interface ChatBalloonOfMessageHistoryProps {
  messageHistory: MessageHistory;
  parentMessageHistory?: MessageHistory;
  onSendNewBranch?: (params: {
    history: MessageHistory;
    message: string;
    role?: 'system' | 'user' | 'assistant';
  }) => void;
  onChangeBranch?: (params: {
    parentHistory: MessageHistory;
    nextId?: string;
  }) => void;
  disabled?: boolean;
}

const FooterMenuButton = ({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => {
  return (
    <button
      type="button"
      className="flex items-center gap-1 text-sm text-on-surface-variant disabled:opacity-20"
      {...props}
    >
      {children}
    </button>
  );
};

const ChangeBranchButton = ({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => {
  return (
    <button
      type="button"
      className="flex justify-center items-center w-6 h-6 on-surface-variant disabled:opacity-20"
      {...props}
    >
      {children}
    </button>
  );
};

export const ChatBalloonOfMessageHistory = ({
  messageHistory,
  parentMessageHistory,
  onSendNewBranch,
  onChangeBranch,
  disabled,
}: ChatBalloonOfMessageHistoryProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClickEdit = useCallback(() => {
    setIsEdit(true);

    if (containerRef.current && !isElementInViewport(containerRef.current)) {
      containerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleClickCancelEdit = useCallback(() => {
    setIsEdit(false);
  }, []);

  const handleSendMessage = useCallback(
    (message: string) => {
      setIsEdit(false);
      if (parentMessageHistory && onSendNewBranch) {
        onSendNewBranch({
          history: parentMessageHistory,
          message,
          role: messageHistory.message.role,
        });
      }
    },
    [parentMessageHistory, messageHistory, onSendNewBranch],
  );

  const handleChangeBranch = useCallback(
    (isNext: boolean) => {
      if (!parentMessageHistory) return;
      if (!onChangeBranch) return;

      const currentIndex = parentMessageHistory.nextIds.findIndex((id) => id === messageHistory.id);
      if (currentIndex === -1) return;

      const nextIndex = isNext ? currentIndex + 1 : currentIndex - 1;
      const nextId = parentMessageHistory.nextIds[nextIndex];
      if (!nextId) return;

      onChangeBranch({
        parentHistory: parentMessageHistory,
        nextId,
      });
    },
    [messageHistory, parentMessageHistory, onChangeBranch],
  );

  const handleChangePrevBranch = useCallback(() => {
    handleChangeBranch(false);
  }, [handleChangeBranch]);

  const handleChangeNextBranch = useCallback(() => {
    handleChangeBranch(true);
  }, [handleChangeBranch]);

  const currentBranchIndex = useMemo(() => {
    if (!parentMessageHistory) return 0;

    const nextIndex = parentMessageHistory.nextIds.findIndex((index) => index === messageHistory.id);
    return nextIndex === -1 ? 0 : nextIndex;
  }, [messageHistory, parentMessageHistory]);

  const maxBranchIndex = useMemo(() => {
    return parentMessageHistory?.nextIds?.length ?? 0;
  }, [parentMessageHistory]);

  if (messageHistory.message.role === 'system') return null;

  return (
    <div className="ChatMessageHistoryBalloon" ref={containerRef}>
      {isEdit && !disabled ? (
        <ChatEditForm
          initMessage={messageHistory.message.content}
          onSend={handleSendMessage}
          onCancel={handleClickCancelEdit}
        />
      ) : (
        <ChatBalloon message={messageHistory.message}>
          <div className="flex justify-between">
            {onSendNewBranch && (
              <FooterMenuButton onClick={handleClickEdit} disabled={disabled}>
                <MdEdit title="Edit" />
              </FooterMenuButton>
            )}
            {maxBranchIndex > 1 && (
              <div className="flex items-center text-sm">
                <ChangeBranchButton onClick={handleChangePrevBranch} disabled={disabled}>
                  <MdChevronLeft title="prev" />
                </ChangeBranchButton>
                <span>
                  {currentBranchIndex + 1} / {maxBranchIndex}
                </span>
                <ChangeBranchButton onClick={handleChangeNextBranch} disabled={disabled}>
                  <MdChevronRight title="next" />
                </ChangeBranchButton>
              </div>
            )}
          </div>
        </ChatBalloon>
      )}
    </div>
  );
};
