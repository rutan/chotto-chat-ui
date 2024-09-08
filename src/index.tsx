import { createRoot } from 'react-dom/client';
import { App } from './App';
import { AppSettingsProvider, DatabaseProvider, SideMenuProvider } from './contexts';
import { createDatabase } from './db';
import { setupI18n } from './i18n';

(async () => {
  const root = document.getElementById('root');
  if (!root) throw new Error('Root element not found');

  const db = createDatabase();

  await setupI18n();

  createRoot(root).render(
    <DatabaseProvider db={db}>
      <AppSettingsProvider>
        <SideMenuProvider>
          <App />
        </SideMenuProvider>
      </AppSettingsProvider>
    </DatabaseProvider>,
  );
})();
