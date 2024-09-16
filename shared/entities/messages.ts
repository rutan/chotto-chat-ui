import { v4 as uuidV4 } from 'uuid';
import { literal, object, string, union, type infer as zInfer } from 'zod';

export const messageSchema = object({
  id: string(),
  chatId: string(),
  role: union([literal('user'), literal('assistant'), literal('system')]),
  content: string(),
  previousId: string().optional(),
  currentNextId: string().optional(),
  nextIds: string().array(),
});

export type Message = zInfer<typeof messageSchema>;

export function initMessage(params: Omit<Message, 'id' | 'nextIds'> & Partial<Pick<Message, 'nextIds'>>): Message {
  return messageSchema.parse({
    id: uuidV4(),
    nextIds: [],
    ...params,
  });
}
