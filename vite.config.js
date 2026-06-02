import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        employers: './for-employers/index.html',
        compare: './compare/index.html',
      }
    }
  },
  server: {
    port: 5173
  }
})
