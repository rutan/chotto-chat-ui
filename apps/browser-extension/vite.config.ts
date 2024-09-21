import { join } from 'node:path';
import { mergeConfig } from 'vite';
import baseConfig from '../../config/vite.config';

const __dirname = new URL('.', import.meta.url).pathname;

export default mergeConfig(baseConfig, {
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: join(__dirname, 'src/background.ts'),
        options: join(__dirname, 'options.html'),
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
  resolve: {
    alias: {
      '@chotto-chat/shared': join(__dirname, '../_shared/src'),
    },
  },
});
