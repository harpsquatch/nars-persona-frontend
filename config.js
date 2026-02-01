import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// Tailwind Configuration
const tailwindConfig = {
  theme: {
    extend: {
      fontFamily: {
        helvetica: ['Helvetica Neue LT Pro', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

// Vite Configuration
const viteConfig = defineConfig({
  plugins: [react()],
});

export { tailwindConfig, viteConfig };
