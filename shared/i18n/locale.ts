import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { en, ja } from './locales';

export function setupI18n() {
  return i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      supportedLngs: ['en', 'ja'],
      resources: {
        en: {
          translation: en,
        },
        ja: {
          translation: ja,
        },
      },
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
}
