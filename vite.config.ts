import vue from '@vitejs/plugin-vue'
import { adaptLegacyVuePlugin } from './vite-legacy-vue.mjs'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  plugins: [adaptLegacyVuePlugin(vue())]
})
