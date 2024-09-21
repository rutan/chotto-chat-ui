import { DialogTitle, Select } from '@headlessui/react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSettings, useGlobalConfig } from '../../hooks';
import { BaseSettingDialog } from './BaseSettingDialog';
import { SettingSection } from './SettingSection';

export interface SettingDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppSettingDialog = ({ isOpen, onClose }: SettingDialogProps) => {
  const { t } = useTranslation();
  const globalConfig = useGlobalConfig();
  const [appSettings, setAppSettings] = useAppSettings();
  const [tmpApiEndpoint, setTmpApiEndpoint] = useState(appSettings.apiEndpoint);

  const handleChangeApiEndpoint = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (globalConfig.limitedEndpoint) return;
      setTmpApiEndpoint(e.target.value);
    },
    [globalConfig],
  );

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
    <BaseSettingDialog isOpen={isOpen} onClose={handleClose}>
      <SettingSection>
        <DialogTitle className="text-xl font-bold mb-2">{t('SettingDialog.apiEndpoint')}</DialogTitle>
        <input
          type="text"
          className="w-full p-2 bg-surface-container text-on-surface disabled:opacity-50"
          value={tmpApiEndpoint}
          placeholder={t('SettingDialog.apiEndpoint.placeholder')}
          onChange={handleChangeApiEndpoint}
          disabled={globalConfig.limitedEndpoint}
        />
        {globalConfig.limitedEndpoint && <p className="text-sm">{t('SettingDialog.apiEndpoint.limited')}</p>}
      </SettingSection>

      <SettingSection>
        <DialogTitle className="text-xl font-bold mb-2">{t('SettingDialog.language')}</DialogTitle>
        <Select
          className="w-full p-2 bg-surface-container text-on-surface"
          value={appSettings.language}
          onChange={handleChangeLanguage}
        >
          <option value="auto">{t('SettingDialog.language.auto')}</option>
          <option value="en">{t('SettingDialog.language.en')}</option>
          <option value="ja">{t('SettingDialog.language.ja')}</option>
        </Select>
      </SettingSection>

      <SettingSection>
        <DialogTitle className="text-xl font-bold mb-2">{t('SettingDialog.colorTheme')}</DialogTitle>
        <Select
          className="w-full p-2 bg-surface-container text-on-surface"
          value={appSettings.colorTheme}
          onChange={handleChangeDarkMode}
        >
          <option value="system">{t('SettingDialog.colorTheme.system')}</option>
          <option value="light">{t('SettingDialog.colorTheme.light')}</option>
          <option value="dark">{t('SettingDialog.colorTheme.dark')}</option>
        </Select>
      </SettingSection>

      <SettingSection>
        <DialogTitle className="text-xl font-bold mb-2">{t('SettingDialog.defaultSystemPrompt')}</DialogTitle>
        <textarea
          className="w-full h-32 p-4 bg-surface-container text-on-surface resize-none"
          value={appSettings.defaultSystemPrompt}
          onChange={handleChangeDefaultSystemPrompt}
          placeholder={t('SettingDialog.defaultSystemPrompt.placeholder')}
        />
      </SettingSection>
    </BaseSettingDialog>
  );
};
