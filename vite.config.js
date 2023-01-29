import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.js',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: /^lit/
    }
  }
})
