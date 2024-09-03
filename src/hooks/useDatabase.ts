import { useContext } from 'react';
import { DatabaseContext } from '../contexts';

export const useDatabase = () => {
  const db = useContext(DatabaseContext);
  if (!db) throw new Error('DatabaseContext not found');

  return db;
};
