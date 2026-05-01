import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@jobs': path.resolve(__dirname, './src/jobs'),
      '@drivers': path.resolve(__dirname, './src/drivers'),
      '@vehicles': path.resolve(__dirname, './src/vehicles'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@events': path.resolve(__dirname, './src/events'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
  },
})
