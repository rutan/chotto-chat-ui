import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Chat } from '../entities';
import { useAppSettings } from '../hooks';
import { cx } from '../libs';

export interface ChatSettingDialogProps {
  chat: Chat;
  isOpen: boolean;
  onUpdateChat: (chat: Chat) => void;
  onClose: () => void;
}

const SettingSection = ({ className, children }: { className?: string; children?: React.ReactNode }) => (
  <section className={cx('mb-4', className)}>{children}</section>
);

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
    <>
      <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="w-full max-w-lg bg-surface text-on-surface p-8 rounded">
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

            <div className="flex justify-center gap-4">
              <button type="button" className="min-h-12 px-8 bg-primary text-on-primary rounded" onClick={handleClose}>
                {t('ChatSettingDialog.close')}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};
