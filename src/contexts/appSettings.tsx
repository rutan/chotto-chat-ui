import { type ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react';
import { type AppSettings, loadAppSettings, updateAppSettings } from '../db';
import { DatabaseContext } from './database';

type RealSetAppSettings = (settings: AppSettings | ((prev: AppSettings) => AppSettings)) => void;

export const AppSettingsContext = createContext<[AppSettings | null, RealSetAppSettings]>([null, () => {}]);

export const AppSettingsProvider = ({
  children,
}: {
  children?: ReactNode;
}) => {
  const db = useContext(DatabaseContext);
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const saveTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!db) return;

    loadAppSettings(db).then((settings) => {
      setAppSettings(settings);
    });
  }, [db]);

  useEffect(() => {
    if (!db) return;
    if (!appSettings) return;

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }

    window.setTimeout(() => {
      saveTimer.current = null;
      updateAppSettings(db, appSettings);
    }, 1000);
  }, [db, appSettings]);

  if (!db || !appSettings) return null;

  return (
    <AppSettingsContext.Provider value={[appSettings, setAppSettings as RealSetAppSettings]}>
      {children}
    </AppSettingsContext.Provider>
  );
};
