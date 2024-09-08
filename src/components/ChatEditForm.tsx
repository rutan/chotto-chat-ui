import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdSend } from 'react-icons/md';
import { cx } from '../libs';
import { ChatTextArea } from './ChatTextArea';

export interface ChatEditFormProps {
  onSend: (message: string) => void;
  initMessage?: string;
  isChatting?: boolean;
  onCancel?: () => void;
}

export const ChatEditForm = ({ onSend, initMessage, isChatting, onCancel }: ChatEditFormProps) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState(initMessage ?? '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.focus();
    textareaRef.current.selectionStart = textareaRef.current.selectionEnd = textareaRef.current.value.length;
  }, []);

  return (
    <form
      className="flex flex-col items-center bg-surface-container  border border-outline rounded text-on-surface"
      action="#"
      onSubmit={handleSubmit}
    >
      <ChatTextArea
        className="flex-grow w-full p-4 bg-transparent resize-none"
        maxRows={8}
        value={message}
        onChange={handleChange}
        disabled={isChatting}
        textareaRef={textareaRef}
      />
      <div className="flex w-full justify-end gap-2 p-2">
        <FormButton className="bg-surface-dim text-on-surface" type="button" onClick={onCancel}>
          <MdSend className="w-4 h-4" title="Send Message" />
          {t('ChatEditForm.cancel')}
        </FormButton>
        <FormButton className="bg-primary text-on-primary" type="submit">
          <MdSend className="w-4 h-4" title="Send Message" />
          {t('ChatEditForm.submit')}
        </FormButton>
      </div>
    </form>
  );
};

const FormButton = ({ className, children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={cx('flex items-center gap-2 rounded px-4 py-2 hover:opacity-80', className)} {...rest}>
    {children}
  </button>
);
