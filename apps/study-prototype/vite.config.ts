/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

const commitHash = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString();

const pwaOptions: Partial<VitePWAOptions> = {
  mode: 'development',
  base: '/',
  includeAssets: ['favicon.svg'],
  manifest: {
    id: 'journai',
    name: 'journai',
    lang: 'en-US',
    dir: 'ltr',
    description: 'AI mentorship for athletes',
    short_name: 'journai',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
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
  workbox: {
    globPatterns: ["**/*.{js,css}"],
    navigateFallback: null,
    navigationPreload: true,
    // Explicitly exclude auth endpoints from service worker
    navigateFallbackDenylist: [/^\/api\/auth/],
    runtimeCaching: [{
      urlPattern: ({ url }) => url.pathname.startsWith('/api/auth'),
      handler: 'NetworkOnly', // Never cache auth requests
    }]
  },
}

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/study-prototype',
  esbuild: {
    exclude: [
      'drizzle-orm', 'drizzle-orm/postgres-js', 'postgres']
  },
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(commitHash),
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
