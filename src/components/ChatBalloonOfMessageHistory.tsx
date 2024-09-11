import { useCallback, useMemo, useRef, useState } from 'react';
import { MdChevronLeft, MdChevronRight, MdEdit } from 'react-icons/md';
import type { Message, OllamaMessage } from '../entities';
import { isElementInViewport } from '../libs';
import { ChatBalloon } from './ChatBalloon';
import { ChatEditForm } from './ChatEditForm';

export interface ChatBalloonOfMessageHistoryProps {
  message: Message;
  parentMessage?: Message;
  onAddChildMessage?: (targetMessage: Message, child: OllamaMessage) => void;
  onChangeBranch?: (targetMessage: Message, nextId: string) => void;
  disabled?: boolean;
}

export const ChatBalloonOfMessageHistory = ({
  message,
  parentMessage,
  onAddChildMessage,
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
    (content: string) => {
      setIsEdit(false);
      if (parentMessage && onAddChildMessage) {
        onAddChildMessage(parentMessage, {
          role: message.role,
          content,
        });
      }
    },
    [message, parentMessage, onAddChildMessage],
  );

  const handleChangeBranch = useCallback(
    (isNext: boolean) => {
      if (!parentMessage) return;
      if (!onChangeBranch) return;

      const currentIndex = parentMessage.nextIds.findIndex((id) => id === message.id);
      if (currentIndex === -1) return;

      const nextIndex = isNext ? currentIndex + 1 : currentIndex - 1;
      const nextId = parentMessage.nextIds[nextIndex];
      if (!nextId) return;

      onChangeBranch(parentMessage, nextId);
    },
    [message, parentMessage, onChangeBranch],
  );

  const handleChangePrevBranch = useCallback(() => {
    handleChangeBranch(false);
  }, [handleChangeBranch]);

  const handleChangeNextBranch = useCallback(() => {
    handleChangeBranch(true);
  }, [handleChangeBranch]);

  const currentBranchIndex = useMemo(() => {
    if (!parentMessage) return 0;

    const nextIndex = parentMessage.nextIds.findIndex((index) => index === message.id);
    return nextIndex === -1 ? 0 : nextIndex;
  }, [message, parentMessage]);

  const maxBranchIndex = useMemo(() => {
    return parentMessage?.nextIds?.length ?? 0;
  }, [parentMessage]);

  const isShowEditView = useMemo(() => {
    return isEdit && !disabled;
  }, [isEdit, disabled]);

  if (message.role === 'system') return null;

  return (
    <div className="ChatMessageHistoryBalloon" ref={containerRef}>
      <ChatBalloon message={message} hiddenMessageBody={isShowEditView}>
        <div className="flex justify-between">
          {isShowEditView ? (
            <div className="w-full">
              <ChatEditForm initMessage={message.content} onSend={handleSendMessage} onCancel={handleClickCancelEdit} />
            </div>
          ) : (
            <>
              {onAddChildMessage && (
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
            </>
          )}
        </div>
      </ChatBalloon>
    </div>
  );
};

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
