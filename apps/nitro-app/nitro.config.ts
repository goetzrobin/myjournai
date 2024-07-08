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
    dir: `${__dirname}/public`
  }],
  runtimeConfig: {
    openApiKey: process.env.NITRO_OPENAI_API_KEY
  },
  modules: ['./modules/tsconfig-paths-to-aliases.ts']
});
