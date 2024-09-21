import { literal, object, string, union, type infer as zInfer } from 'zod';

export const appSettingsSchema = object({
  colorTheme: union([literal('system'), literal('light'), literal('dark')]).default('system'),
  apiEndpoint: string().default('http://localhost:11434'),
  language: union([literal('auto'), literal('en'), literal('ja')]).default('auto'),
  defaultSystemPrompt: string().default(''),
});

export type AppSettings = zInfer<typeof appSettingsSchema>;
