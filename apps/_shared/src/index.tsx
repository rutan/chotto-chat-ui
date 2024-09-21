import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import {
  AppSettingsProvider,
  ChatsProvider,
  DatabaseProvider,
  type GlobalConfig,
  GlobalConfigProvider,
  SideMenuProvider,
} from './contexts';
import { createDatabase } from './db';
import { setupI18n } from './i18n';

export interface AppOptions {
  config: GlobalConfig;
}

export async function init({ config }: AppOptions) {
  const root = document.getElementById('root');
  if (!root) throw new Error('Root element not found');

  const queryClient = new QueryClient();
  const db = createDatabase();

  await setupI18n();

  const app = (
    <GlobalConfigProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <DatabaseProvider db={db}>
          <AppSettingsProvider>
            <ChatsProvider>
              <SideMenuProvider>
                <App />
              </SideMenuProvider>
            </ChatsProvider>
          </AppSettingsProvider>
        </DatabaseProvider>
      </QueryClientProvider>
    </GlobalConfigProvider>
  );

  createRoot(root).render(app);
}
