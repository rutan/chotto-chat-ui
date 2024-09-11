import { type Chat, type Message, chatSchema } from '../entities';
import type { Database } from './database';
import { saveMessages } from './messages';

export async function loadChats(
  db: Database,
  params: {
    limit?: number;
    offset?: number;
    orderBy?: 'createdAt' | 'updatedAt';
  },
): Promise<Chat[]> {
  const offset = params.offset ?? 0;
  const limit = params.limit ?? 10;
  const orderBy = params.orderBy ?? 'updatedAt';

  try {
    return (await db.chats.orderBy(orderBy).reverse().offset(offset).limit(limit).toArray()).map((chat) =>
      chatSchema.parse(chat),
    );
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function createChat(db: Database, chat: Chat, messages: Message[]) {
  await db.transaction('rw', db.messages, db.chats, async () => {
    await db.chats.add(chat);
    await saveMessages(db, messages);
  });

  return {
    chat,
    messages,
  };
}

export async function saveChat(db: Database, chat: Chat): Promise<void> {
  await db.chats.put(chat);
}

export async function removeChat(db: Database, chat: Chat): Promise<void> {
  await db.chats.delete(chat.id);
}
