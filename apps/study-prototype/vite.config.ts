/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { VitePWA } from 'vite-plugin-pwa';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/study-prototype',
  esbuild: {
    exclude: ['drizzle-orm', 'drizzle-orm/postgres-js', 'postgres', 'drizzle-orm/pg-core']
  },
  server: {
    port: 4200,
    host: 'localhost',
    proxy: {
      '/api': 'http://localhost:3000',
    }
  },

  preview: {
    port: 4300,
    host: 'localhost'
  },

  plugins: [
    TanStackRouterVite(),
    react(),
    VitePWA({ registerType: 'autoUpdate' }),
    nxViteTsPaths(),
  ],

  // Uncomment this if you are using workers.
  worker: {
    plugins: () => [nxViteTsPaths()]
  },

  build: {
    outDir: '../../dist/apps/study-prototype',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
});
