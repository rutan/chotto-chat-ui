import React, { useState } from 'react';

export interface ChatFormProps {
  onSend: (message: string) => void;
}

export const ChatForm = ({ onSend }: ChatFormProps) => {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      e.currentTarget.form?.dispatchEvent(new Event('submit', { bubbles: true }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value);
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message) onSend(message);
  };

  return (
    <form action="#" onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
      />
      <button type="submit">Send</button>
    </form>
  );
};
