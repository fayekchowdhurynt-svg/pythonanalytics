import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base is set relative so the built app works when served from a GitHub
// Pages project subpath (https://<user>.github.io/<repo>/). Override via
// VITE_BASE if deploying to a custom domain or user/org page instead.
export default defineConfig({
  base: process.env.VITE_BASE ?? './',
  plugins: [react(), tailwindcss()],
  // Classic (non-module) worker format is required because the Pyodide
  // worker uses importScripts() to load the runtime from CDN — that API
  // does not exist in ES-module workers.
  worker: {
    format: 'iife',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
