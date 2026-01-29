import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    dedupe: ['vue'],
  },

  server: {
    port: 5173,
    strictPort: true,
    host: '127.0.0.1',
  },

  preview: {
    port: 4173,
    strictPort: true,
  },

  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia'],
  },

  build: {
    sourcemap: true,
    target: 'es2022',
  },

  cacheDir: 'node_modules/.vite',
})
