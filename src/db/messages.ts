import { type Message, messageSchema } from '../entities';
import type { Database } from './database';

export async function loadMessages(db: Database, chatId: string): Promise<Message[]> {
  try {
    return (await db.messages.where('chatId').equals(chatId).toArray()).map((message) => {
      return messageSchema.parse(message);
    });
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function saveMessage(db: Database, message: Message) {
  await db.messages.put(message);
}

export async function saveMessages(db: Database, messages: Message[]) {
  await db.transaction('rw', db.messages, async () => {
    for (const message of messages) {
      await db.messages.put(message);
    }
  });
}
