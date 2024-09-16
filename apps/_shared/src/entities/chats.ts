import { v4 as uuidV4 } from 'uuid';
import { date, object, string, type infer as zInfer } from 'zod';

export const chatSchema = object({
  id: string(),
  title: string(),
  modelName: string(),
  systemPrompt: string(),
  createdAt: date(),
  updatedAt: date(),
});

export type Chat = zInfer<typeof chatSchema>;

export function initChat(params: Partial<Chat> = {}): Chat {
  return chatSchema.parse({
    id: uuidV4(),
    title: '',
    modelName: '',
    systemPrompt: '',
    createdAt: new Date(0),
    updatedAt: new Date(0),
    ...params,
  });
}

export function isNewChat(chat: Chat): boolean {
  return chat.createdAt.getTime() === 0;
}
