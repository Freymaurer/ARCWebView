// vite.config.lib.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [react(), dts({
    entryRoot: "src",
    outDir: "dist",
    include: ['src/**/*.ts', 'src/**/*.tsx'],
    exclude: ['src/main.tsx' ], // Exclude main entry point
    tsconfigPath: './tsconfig.app.json',
  })],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/lib.ts'),
      name: 'ArcWebView',
      fileName: (format) => `index.${format}.js`,
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        '@nfdi4plants/arctrl',
        "@primer/css",
        "@primer/primitives",
        "@primer/react",
        "marked",
        "mermaid",
        'react', 
        'react-dom',
        "styled-components"
      ]
    },
  },
})
