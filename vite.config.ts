import pages from '@hono/vite-cloudflare-pages'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [pages()],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: false
  }
})
