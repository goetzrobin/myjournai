//https://nitro.unjs.io/config
import { join } from 'path';
import { workspaceRoot } from '@nx/devkit';
import { resolve } from 'node:path';
import { normalizePath } from 'vite';

export default defineNitroConfig({
  rootDir: '../..',
  srcDir: 'apps/nitro-app/server',

  output: {
    dir: normalizePath(resolve(workspaceRoot, '.vercel', 'output')),
    publicDir: normalizePath(
      resolve(workspaceRoot, '.vercel', 'output', 'static')
    )
  },
  publicAssets: [{
    baseURL: '',
    dir: join(workspaceRoot, 'dist', 'apps', 'study-prototype')
  }],
  runtimeConfig: {
    openApiKey: process.env.NITRO_OPENAI_API_KEY,
    anthropicApiKey: process.env.NITRO_ANTHROPIC_API_KEY,
    groqApiKey: process.env.NITRO_GROQ_API_KEY
  },
  routeRules: {
    '/api/auth/**': {
      cache: {
        maxAge: 0,
        swr: false,
        staleMaxAge: 0
      },
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    }
  },
  modules: ['./modules/tsconfig-paths-to-aliases.ts'],
  vercel: {
    functions: {
      maxDuration: 60
    }
  }
});
