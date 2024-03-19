import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    secure: false,
    proxy: {
      '/oauth2-cc/token': 'https://api.hume.ai',
      '/v0/assistant/chat': 'https://api.hume.ai',
    },
  },
});
