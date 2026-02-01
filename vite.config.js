// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'
// import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],   
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.svg', 'logo192.png', 'logo512.png'],
      manifest: {
        name: 'NARS Persona',
        short_name: 'NARS Persona',
        description: 'Your Personal Beauty Consultant',
        theme_color: '#1E1E1E',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/logo192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/logo512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  envDir: '.', // explicitly set the directory containing .env files
  define: {
    'process.env': process.env
  },
  theme: {
    extend: {
      fontFamily: {
        helvetica: ['Helvetica Neue LT Pro', 'sans-serif'],
      },
    },
  }
});
// import { viteConfig } from './config.js';

// export default viteConfig;
