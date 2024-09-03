import Dexie from 'dexie';
import type { AppSettings } from './settings';

const DATABASE_NAME = 'chotto-chat-ui';

export class Database extends Dexie {
  settings!: Dexie.Table<{ key: string; value: AppSettings }, string>;

  constructor(databaseName: string) {
    super(databaseName);

    this.version(1).stores({
      settings: 'key',
    });
  }
}

export function createDatabase() {
  return new Database(DATABASE_NAME);
}
