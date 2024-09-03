import { createRoot } from 'react-dom/client';
import { App } from './App';
import { AppSettingsProvider, DatabaseProvider } from './contexts';
import { createDatabase } from './db';

(async () => {
  const root = document.getElementById('root');
  if (!root) throw new Error('Root element not found');

  const db = createDatabase();

  createRoot(root).render(
    <DatabaseProvider db={db}>
      <AppSettingsProvider>
        <App />
      </AppSettingsProvider>
    </DatabaseProvider>,
  );
})();
