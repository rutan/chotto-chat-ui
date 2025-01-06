import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdArrowDropDown, MdSend } from 'react-icons/md';
import { cx } from '../libs';
import { ChatTextArea } from './ChatTextArea';

export interface ChatEditFormProps {
  onSend: (message: string) => void;
  onRegenerateAssistantMessage?: (message: string) => void;
  initMessage?: string;
  isChatting?: boolean;
  onCancel?: () => void;
}

export const ChatEditForm = ({
  onSend,
  onRegenerateAssistantMessage,
  initMessage,
  isChatting,
  onCancel,
}: ChatEditFormProps) => {
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

  const handleRegenerateAssistantMessage = useCallback(() => {
    if (!onRegenerateAssistantMessage) return;

    if (message) {
      onRegenerateAssistantMessage(message);
      setMessage('');
    }
  }, [message, onRegenerateAssistantMessage]);

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
          {t('ChatEditForm.cancel')}
        </FormButton>
        <SubmitButton
          onRegenerateAssistantMessage={onRegenerateAssistantMessage ? handleRegenerateAssistantMessage : undefined}
        />
      </div>
    </form>
  );
};

const FormButton = ({ className, children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={cx('flex items-center gap-2 rounded px-4 py-2 hover:opacity-80', className)} {...rest}>
    {children}
  </button>
);

const SubmitButton = ({
  onRegenerateAssistantMessage,
}: {
  onRegenerateAssistantMessage?: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className={cx('flex items-center')}>
      <button
        type="submit"
        className={cx(
          'flex items-center gap-2 px-4 py-2  bg-primary text-on-primary hover:opacity-80',
          onRegenerateAssistantMessage ? 'rounded-l' : 'rounded',
        )}
      >
        <MdSend className="w-4 h-4" title="Send Message" />
        {t('ChatEditForm.submit')}
      </button>
      {onRegenerateAssistantMessage && (
        <Menu>
          <MenuButton className="flex items-center h-full rounded-r bg-primary text-on-primary px-2 hover:opacity-80">
            <MdArrowDropDown className="w-4 h-4" title="Menu" />
          </MenuButton>
          <MenuItems anchor="bottom end" className="z-50 bg-surface p-1 rounded shadow-md">
            <MenuItem>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 hover:bg-surface-dim"
                onClick={onRegenerateAssistantMessage}
              >
                {t('ChatEditForm.regenerateWithIntro')}
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      )}
    </div>
  );
};
