import { literal, object, string, union, type infer as zInfer } from 'zod';
import type { Database } from './database';

export const appSettingsSchema = object({
  colorTheme: union([literal('system'), literal('light'), literal('dark')]).default('system'),
  apiEndpoint: string().default('http://localhost:11434'),
  language: union([literal('auto'), literal('en'), literal('ja')]).default('auto'),
  defaultSystemPrompt: string().default('You are assistant bot.'),
});

export type AppSettings = zInfer<typeof appSettingsSchema>;

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
