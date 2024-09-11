import Dexie from 'dexie';
import type { AppSettings, Chat, Message } from '../entities';

const DATABASE_NAME = 'chotto-chat-ui';

export class Database extends Dexie {
  chats!: Dexie.Table<Chat, string>;
  messages!: Dexie.Table<Message, string>;
  settings!: Dexie.Table<{ key: string; value: AppSettings }, string>;

  constructor(databaseName: string) {
    super(databaseName);

    this.version(2).stores({
      chats: 'id, title, createdAt, updatedAt',
      messages: 'id, chatId, role, previousId, currentNextId',
      settings: 'key',
    });
  }
}

export function createDatabase() {
  return new Database(DATABASE_NAME);
}
