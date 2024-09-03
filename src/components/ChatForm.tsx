import { type ChangeEvent, type KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdSend } from 'react-icons/md';
import TextareaAutosize from 'react-textarea-autosize';

export interface ChatFormProps {
  onSend: (message: string) => void;
  initMessage?: string;
  isChatting?: boolean;
  onCancelChat?: () => void;
}

export const ChatForm = ({ onSend, initMessage, isChatting, onCancelChat }: ChatFormProps) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState(initMessage ?? '');
  const [isComposing, setIsComposing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
        e.preventDefault();
        e.currentTarget.form?.dispatchEvent(new Event('submit', { bubbles: true }));
      }
    },
    [isComposing],
  );

  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value);
    setIsFocused(true);
  }, []);

  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback(() => {
    setIsComposing(false);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (message) {
        onSend(message);
        setMessage('');
        setIsFocused(true);
      }
    },
    [message, onSend],
  );

  useEffect(() => {
    if (isChatting) return;
    if (!isFocused) return;

    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isChatting, isFocused]);

  return (
    <form
      className="flex items-center gap-2 bg-surface border border-outline rounded text-on-surface"
      action="#"
      onSubmit={handleSubmit}
    >
      <TextareaAutosize
        className="flex-grow w-full p-4 bg-transparent resize-none"
        maxRows={5}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onBlur={handleBlur}
        disabled={isChatting}
        placeholder={t('ChatForm.placeholder')}
        ref={textareaRef}
      >
        {message}
      </TextareaAutosize>
      {isChatting ? (
        onCancelChat && (
          <button className="px-4" type="button" onClick={onCancelChat}>
            Cancel
          </button>
        )
      ) : (
        <button
          className="flex items-center justify-center shrink-0 w-10 h-10 mr-2 rounded-full bg-primary text-on-primary hover:opacity-80"
          type="submit"
        >
          <MdSend className="w-4 h-4" title="Send Message" />
        </button>
      )}
    </form>
  );
};
