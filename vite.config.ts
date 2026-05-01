import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@drivers': path.resolve(__dirname, './src/drivers'),
      '@vehicles': path.resolve(__dirname, './src/vehicles'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@events': path.resolve(__dirname, './src/events'),
      '@reservations': path.resolve(__dirname, './src/reservations'),
      '@trips': path.resolve(__dirname, './src/trips')
    },
  },
})
