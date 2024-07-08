import { readFileSync } from 'fs';
import { join } from 'path';
import { workspaceRoot } from '@nx/devkit';

export default defineNitroModule({
  name: 'tsconfig-paths-to-aliases',
  setup(this: void, nitro) {
    const tsconfig = JSON.parse(readFileSync(join(workspaceRoot, 'tsconfig.base.json')).toString());
    const paths = tsconfig.compilerOptions.paths;
    const aliases = Object.entries(paths).reduce((aliases, [aliasKey, aliasValue]) => ({
      ...aliases,
      [aliasKey]: join(workspaceRoot, aliasValue[0])
    }), {});
    nitro.options.alias ??= {};
    nitro.options.alias = { ...nitro.options.alias, ...aliases };
  }
});
