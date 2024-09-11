import { literal, object, string, union, type infer as zInfer } from 'zod';

export const ollamaModelSchema = object({
  name: string(),
});

export type OllamaModel = zInfer<typeof ollamaModelSchema>;

export const ollamaMessageRoleSchema = union([literal('user'), literal('assistant'), literal('system')]);

export type OllamaMessageRole = zInfer<typeof ollamaMessageRoleSchema>;

export const ollamaMessageSchema = object({
  role: ollamaMessageRoleSchema,
  content: string(),
});

export type OllamaMessage = zInfer<typeof ollamaMessageSchema>;
