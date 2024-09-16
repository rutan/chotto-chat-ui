import { type AppSettings, appSettingsSchema } from '../entities';
import type { Database } from './database';

function initialAppSettings(): AppSettings {
  return appSettingsSchema.parse({});
}

const APP_SETTINGS_KEY = 'appSettings';

export async function loadAppSettings(db: Database): Promise<AppSettings> {
  try {
    const res = await db.settings.get(APP_SETTINGS_KEY);
    if (!res) return initialAppSettings();

    return appSettingsSchema.parse(res.value);
  } catch (e) {
    console.error(e);
    return initialAppSettings();
  }
}

export async function updateAppSettings(db: Database, settings: AppSettings): Promise<void> {
  await db.settings.put({ key: APP_SETTINGS_KEY, value: appSettingsSchema.parse(settings) });
}
