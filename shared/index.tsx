import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { AppSettingsProvider, ChatsProvider, DatabaseProvider, SideMenuProvider } from './contexts';
import { createDatabase } from './db';
import { setupI18n } from './i18n';

export async function init() {
  const root = document.getElementById('root');
  if (!root) throw new Error('Root element not found');

  const queryClient = new QueryClient();
  const db = createDatabase();

  await setupI18n();

  createRoot(root).render(
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
    </QueryClientProvider>,
  );
}
