import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Select } from '@headlessui/react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSettings } from '../hooks';
import { cx } from '../libs';

export interface SettingDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingSection = ({ className, children }: { className?: string; children?: React.ReactNode }) => (
  <section className={cx('mb-4', className)}>{children}</section>
);

export const SettingDialog = ({ isOpen, onClose }: SettingDialogProps) => {
  const { t } = useTranslation();
  const [appSettings, setAppSettings] = useAppSettings();
  const [tmpApiEndpoint, setTmpApiEndpoint] = useState(appSettings.apiEndpoint);

  const handleChangeApiEndpoint = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTmpApiEndpoint(e.target.value);
  }, []);

  const handleChangeLanguage = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newLanguage = e.target.value as 'auto' | 'en' | 'ja';
      setAppSettings((prev) => ({ ...prev, language: newLanguage }));
    },
    [setAppSettings],
  );

  const handleChangeDarkMode = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newColorTheme = e.target.value as 'system' | 'light' | 'dark';
      setAppSettings((prev) => ({ ...prev, colorTheme: newColorTheme }));
    },
    [setAppSettings],
  );

  const handleChangeDefaultSystemPrompt = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setAppSettings((prev) => ({ ...prev, defaultSystemPrompt: e.target.value }));
    },
    [setAppSettings],
  );

  const handleClose = useCallback(() => {
    setAppSettings((prev) => ({ ...prev, apiEndpoint: tmpApiEndpoint }));
    onClose();
  }, [onClose, setAppSettings, tmpApiEndpoint]);

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="w-full max-w-lg bg-surface text-on-surface p-8 rounded">
            <SettingSection>
              <DialogTitle className="text-xl font-bold">{t('SettingDialog.apiEndpoint')}</DialogTitle>
              <input
                type="text"
                className="w-full p-2 bg-surface-container text-on-surface my-4"
                value={tmpApiEndpoint}
                placeholder={t('SettingDialog.apiEndpoint.placeholder')}
                onChange={handleChangeApiEndpoint}
              />
            </SettingSection>

            <SettingSection>
              <DialogTitle className="text-xl font-bold">{t('SettingDialog.language')}</DialogTitle>
              <Select
                className="w-full p-2 bg-surface-container text-on-surface my-4"
                value={appSettings.language}
                onChange={handleChangeLanguage}
              >
                <option value="auto">{t('SettingDialog.language.auto')}</option>
                <option value="en">{t('SettingDialog.language.en')}</option>
                <option value="ja">{t('SettingDialog.language.ja')}</option>
              </Select>
            </SettingSection>

            <SettingSection>
              <DialogTitle className="text-xl font-bold">{t('SettingDialog.colorTheme')}</DialogTitle>
              <Select
                className="w-full p-2 bg-surface-container text-on-surface my-4"
                value={appSettings.colorTheme}
                onChange={handleChangeDarkMode}
              >
                <option value="system">{t('SettingDialog.colorTheme.system')}</option>
                <option value="light">{t('SettingDialog.colorTheme.light')}</option>
                <option value="dark">{t('SettingDialog.colorTheme.dark')}</option>
              </Select>
            </SettingSection>

            <SettingSection>
              <DialogTitle className="text-xl font-bold">{t('SettingDialog.defaultSystemPrompt')}</DialogTitle>
              <textarea
                className="w-full h-32 p-4 bg-surface-container text-on-surface resize-none my-4"
                value={appSettings.defaultSystemPrompt}
                onChange={handleChangeDefaultSystemPrompt}
                placeholder={t('SettingDialog.defaultSystemPrompt.placeholder')}
              />
            </SettingSection>

            <div className="flex justify-center gap-4">
              <button type="button" className="min-h-12 px-8 bg-primary text-on-primary rounded" onClick={handleClose}>
                {t('SettingDialog.close')}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};
