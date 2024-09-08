import { useCallback, useState } from 'react';
import { MdSend } from 'react-icons/md';
import { ChatTextArea } from './ChatTextArea';

export interface ChatFormProps {
  onSend: (message: string) => void;
  initMessage?: string;
  isChatting?: boolean;
  onCancelChat?: () => void;
}

export const ChatForm = ({ onSend, initMessage, isChatting, onCancelChat }: ChatFormProps) => {
  const [message, setMessage] = useState(initMessage ?? '');

  const handleChange = useCallback((message: string) => {
    setMessage(message);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (message) {
        onSend(message);
        setMessage('');
      }
    },
    [message, onSend],
  );

  return (
    <form
      className="flex items-center gap-2 bg-surface border border-outline rounded text-on-surface"
      action="#"
      onSubmit={handleSubmit}
    >
      <ChatTextArea
        className="flex-grow w-full p-4 bg-transparent resize-none"
        maxRows={5}
        value={message}
        onChange={handleChange}
        autoSubmit={true}
        disabled={isChatting}
      />
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
