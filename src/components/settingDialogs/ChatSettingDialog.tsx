import { DialogTitle } from '@headlessui/react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Chat } from '../../entities';
import { useAppSettings } from '../../hooks';
import { BaseSettingDialog } from './BaseSettingDialog';
import { SettingSection } from './SettingSection';

export interface ChatSettingDialogProps {
  chat: Chat;
  isOpen: boolean;
  onUpdateChat: (chat: Chat) => void;
  onClose: () => void;
}

export const ChatSettingDialog = ({ chat, onUpdateChat, isOpen, onClose }: ChatSettingDialogProps) => {
  const { t } = useTranslation();
  const [appSettings] = useAppSettings();
  const [tmpTitle, setTmpTitle] = useState(chat.title);
  const [tmpSystemPrompt, setTmpSystemPrompt] = useState(chat.systemPrompt);

  const handleChangeTitle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTmpTitle(e.target.value);
  }, []);

  const handleChangeSystemPrompt = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTmpSystemPrompt(e.target.value);
  }, []);

  const handleClose = useCallback(() => {
    onUpdateChat({
      ...chat,
      title: tmpTitle,
      systemPrompt: tmpSystemPrompt,
    });
    onClose();
  }, [chat, onClose, onUpdateChat, tmpTitle, tmpSystemPrompt]);

  return (
    <BaseSettingDialog isOpen={isOpen} onClose={handleClose}>
      <SettingSection>
        <DialogTitle className="text-xl font-bold">{t('ChatSettingDialog.title')}</DialogTitle>
        <input
          type="text"
          className="w-full p-2 bg-surface-container text-on-surface my-4"
          value={tmpTitle}
          placeholder={t('ChatSettingDialog.title.placeholder')}
          onChange={handleChangeTitle}
        />
      </SettingSection>

      <SettingSection>
        <DialogTitle className="text-xl font-bold">{t('ChatSettingDialog.systemPrompt')}</DialogTitle>
        <textarea
          className="w-full p-2 bg-surface-container text-on-surface my-4"
          value={tmpSystemPrompt}
          placeholder={appSettings.defaultSystemPrompt}
          onChange={handleChangeSystemPrompt}
        />
      </SettingSection>
    </BaseSettingDialog>
  );
};
