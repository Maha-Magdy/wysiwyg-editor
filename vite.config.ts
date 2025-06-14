import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
  base: '/wysiwyg-editor/',
})
