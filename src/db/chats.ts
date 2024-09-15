import { type Chat, type Message, chatSchema, isNewChat } from '../entities';
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
  const oldCreatedAt = chat.createdAt;
  const oldUpdatedAt = chat.updatedAt;

  try {
    await db.transaction('rw', db.messages, db.chats, async () => {
      if (isNewChat(chat)) chat.createdAt = new Date();
      chat.updatedAt = new Date();

      await db.chats.add(chat);
      await saveMessages(db, messages);
    });

    return {
      chat,
      messages,
    };
  } catch (e) {
    chat.createdAt = oldCreatedAt;
    chat.updatedAt = oldUpdatedAt;

    throw e;
  }
}

export async function saveChat(db: Database, chat: Chat) {
  const oldUpdatedAt = chat.updatedAt;

  try {
    chat.updatedAt = new Date();
    await db.chats.put(chat);
    return chat;
  } catch (e) {
    chat.updatedAt = oldUpdatedAt;

    throw e;
  }
}

export async function removeChat(db: Database, chat: Chat): Promise<void> {
  await db.transaction('rw', db.messages, db.chats, async () => {
    await db.messages.where({ chatId: chat.id }).delete();
    await db.chats.delete(chat.id);
  });
}
