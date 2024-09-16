import { type ChangeEvent, type KeyboardEvent, type RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextareaAutosize from 'react-textarea-autosize';

export interface ChatTextAreaProps {
  className?: string;
  value?: string;
  onChange: (message: string) => void;
  maxRows?: number;
  disabled?: boolean;
  autoSubmit?: boolean;
  textareaRef?: RefObject<HTMLTextAreaElement>;
}

export const ChatTextArea = ({
  className,
  value,
  onChange,
  maxRows,
  disabled,
  autoSubmit,
  textareaRef,
}: ChatTextAreaProps) => {
  const { t } = useTranslation();
  const [isComposing, setIsComposing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const localTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (!autoSubmit) return;

      if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
        e.preventDefault();
        e.currentTarget.form?.dispatchEvent(new Event('submit', { bubbles: true }));
      }
    },
    [autoSubmit, isComposing],
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.currentTarget.value);
      setIsFocused(true);
    },
    [onChange],
  );

  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback(() => {
    setIsComposing(false);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  useEffect(() => {
    if (disabled) return;
    if (!isFocused) return;

    const ref = textareaRef ?? localTextareaRef;
    ref.current?.focus();
  }, [textareaRef, disabled, isFocused]);

  return (
    <TextareaAutosize
      className={className}
      maxRows={maxRows ?? 5}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onBlur={handleBlur}
      disabled={disabled}
      placeholder={t('ChatTextArea.placeholder')}
      ref={textareaRef ?? localTextareaRef}
    >
      {value}
    </TextareaAutosize>
  );
};
