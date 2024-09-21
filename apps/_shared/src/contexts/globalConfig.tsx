import { type ReactNode, createContext } from 'react';

export interface GlobalConfig {
  fetchFns: {
    fetchJsonFn: <T>(input: RequestInfo, init?: RequestInit) => Promise<T>;
    fetchReaderFn: (input: RequestInfo, init?: RequestInit) => Promise<ReadableStreamDefaultReader>;
  };
  limitedEndpoint?: boolean;
}

export const GlobalConfigContext = createContext<GlobalConfig>({
  fetchFns: {
    fetchJsonFn: async (_input, _init) => {
      throw new Error('fetchJsonFn not initialized');
    },
    fetchReaderFn: async (_input, _init) => {
      throw new Error('fetchReaderFn not initialized');
    },
  },
});

export const GlobalConfigProvider = ({ config, children }: { config: GlobalConfig; children?: ReactNode }) => {
  return <GlobalConfigContext.Provider value={config}>{children}</GlobalConfigContext.Provider>;
};
