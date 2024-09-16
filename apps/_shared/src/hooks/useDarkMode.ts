import { useEffect } from 'react';
import type { AppSettings } from '../entities';

export function useDarkMode(appSettings: AppSettings) {
  useEffect(() => {
    const root = document.documentElement;
    switch (appSettings.colorTheme) {
      case 'system':
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          root.classList.add('dark');
          root.classList.remove('light');
        } else {
          root.classList.add('light');
          root.classList.remove('dark');
        }
        break;
      case 'light':
        root.classList.add('light');
        root.classList.remove('dark');
        break;
      case 'dark':
        root.classList.add('dark');
        root.classList.remove('light');
        break;
    }
    if (appSettings.colorTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [appSettings.colorTheme]);
}
