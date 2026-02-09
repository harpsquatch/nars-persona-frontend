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

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
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
