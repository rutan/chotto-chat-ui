import { type ReactNode, createContext } from 'react';
import type { Database } from '../db';

export const DatabaseContext = createContext<Database | null>(null);

export const DatabaseProvider = ({
  db,
  children,
}: {
  db: Database;
  children?: ReactNode;
}) => {
  return <DatabaseContext.Provider value={db}>{children}</DatabaseContext.Provider>;
};
