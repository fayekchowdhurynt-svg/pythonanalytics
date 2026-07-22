import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// base is set relative so the built app works when served from a GitHub
// Pages project subpath (https://<user>.github.io/<repo>/). Override via
// VITE_BASE if deploying to a custom domain or user/org page instead.
export default defineConfig({
  base: process.env.VITE_BASE ?? './',
  plugins: [react()],
  worker: {
    format: 'es',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
