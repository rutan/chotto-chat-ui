import React, { useCallback, useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

export interface ChatFormProps {
  onSend: (message: string) => void;
  isChatting?: boolean;
  onCancelChat?: () => void;
}

export const ChatForm = ({ onSend, isChatting, onCancelChat }: ChatFormProps) => {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
        e.preventDefault();
        e.currentTarget.form?.dispatchEvent(new Event('submit', { bubbles: true }));
      }
    },
    [isComposing],
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
  }, [isChatting]);

  return (
    <form className="flex bg-pane-weaker-bg rounded" action="#" onSubmit={handleSubmit}>
      <TextareaAutosize
        className="flex-grow w-full p-4 bg-transparent"
        maxRows={5}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onBlur={handleBlur}
        disabled={isChatting}
        placeholder="Type a message..."
        ref={textareaRef}
      />
      {isChatting ? (
        onCancelChat && (
          <button className="px-4" type="button" onClick={onCancelChat}>
            Cancel
          </button>
        )
      ) : (
        <button className="px-4" type="submit">
          Send
        </button>
      )}
    </form>
  );
};
