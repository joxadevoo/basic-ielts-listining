import { defineConfig, loadEnv } from 'vite';
import { vercelApiDevPlugin } from './vite-api-plugin.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: 3000,
      open: true,
      host: true,
    },
    plugins: [vercelApiDevPlugin(env)],
  };
});