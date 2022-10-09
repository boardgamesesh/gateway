import { App } from '@serverless-stack/resources';
import { Api } from './Api';
import { Database } from './Database';

export default function main(app: App) {
  app.setDefaultFunctionProps({
    runtime: 'nodejs16.x',
    srcPath: 'src',
    bundle: {
      format: 'esm',
    },
  });
  app.stack(Database).stack(Api);
}
