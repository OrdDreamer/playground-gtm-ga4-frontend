import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Оптимізація розміру бандлів
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
        },
      },
    },
    // Збільшуємо ліміт для попередження про великі чанки
    chunkSizeWarningLimit: 1000,
    // Оптимізація для production
    minify: 'esbuild',
    sourcemap: false,
  },
  // Base path (залишаємо порожнім для кореня)
  base: '/',
})
