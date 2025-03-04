import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'  // or '@vitejs/plugin-react-swc' if you installed that
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}) 