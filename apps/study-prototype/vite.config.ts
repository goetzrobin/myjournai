/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

const pwaOptions: Partial<VitePWAOptions> = {
  mode: 'development',
  base: '/',
  includeAssets: ['favicon.svg'],
  manifest: {
    name: 'journai',
    short_name: 'journai',
    theme_color: '#141414',
    icons: [
      {
        src: 'pwa-192x192.png', // <== don't add slash, for testing
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/pwa-512x512.png', // <== don't remove slash, for testing
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png', // <== don't add slash, for testing
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  },
  devOptions: {
    enabled: process.env.SW_DEV === 'true',
    /* when using generateSW the PWA plugin will switch to classic */
    type: 'module',
    navigateFallback: 'index.html',
  },
}

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/study-prototype',
  esbuild: {
    exclude: [
      'drizzle-orm', 'drizzle-orm/postgres-js', 'postgres']
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
    VitePWA(pwaOptions),
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
