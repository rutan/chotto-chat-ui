import { useContext, useEffect } from 'react';
import { AppSettingsContext } from '../contexts';

export const useAppSettings = () => {
  const [appSettings, setAppSettings] = useContext(AppSettingsContext);
  if (!appSettings) throw new Error('AppSettingsContext not found');

  return [appSettings, setAppSettings] as const;
};
