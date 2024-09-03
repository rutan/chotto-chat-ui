import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { AppSettings } from '../db';

export function useLocale(appSettings: AppSettings) {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (appSettings.language === 'auto') {
      i18n.changeLanguage(navigator.language);
      return;
    }
    i18n.changeLanguage(appSettings.language);
  }, [i18n, appSettings.language]);
}
