import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/ARCWebView',
  plugins: [react()],
  resolve: {
    alias: {
      'fs/promises': path.resolve(__dirname, './src/stubs/fs-promises-mock.js'),
      fs: path.resolve(__dirname, './src/stubs/fs-mock.js'),
      path: path.resolve(__dirname, './src/stubs/path-mock.js'),
    },
  },
})
