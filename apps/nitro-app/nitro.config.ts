//https://nitro.unjs.io/config
import { join } from 'path';
import { workspaceRoot } from '@nx/devkit';

export default defineNitroConfig({
  rootDir: '../..',
  srcDir: 'apps/nitro-app/server',
  output: {
    dir: join(workspaceRoot, 'dist', 'apps', 'nitro-app', '.output'),
    serverDir: join(workspaceRoot, 'dist', 'apps', 'nitro-app', '.output/server'),
    publicDir: join(workspaceRoot, 'dist', 'apps', 'nitro-app', '.output/public')
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
  modules: ['./modules/tsconfig-paths-to-aliases.ts'],
});
