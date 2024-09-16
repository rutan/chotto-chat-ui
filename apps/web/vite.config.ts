import { join } from 'node:path';
import { defineConfig } from 'vite';
import baseConfig from '../../config/vite.config';

const __dirname = new URL('.', import.meta.url).pathname;

export default defineConfig({
  ...baseConfig,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@chotto-chat/shared': join(__dirname, '../_shared/src'),
    },
  },
});
