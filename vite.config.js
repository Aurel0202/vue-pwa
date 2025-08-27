import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: null, //Ne pas enregistrer de service worker automatiquement
      manifest: {
        name: 'Démo pwa avec vue',
        short_name: 'Description de cet app',
        theme_color: '#ff0000',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'icons/favicon-32x32.png',
            type: 'image/png',
            sizes: '32x32',
          },
          {
            src: 'icons/favicon-256x256.png',
            type: 'image/png',
            sizes: '256x256',
            purpose: 'any maskable',
          },
        ],
      },
      devOptions: {
        enabled: true, // Active le comportement PWA en dev
        //suppressWarnings: true, // (Optionnel) Evite les warning sur le mode dev
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
