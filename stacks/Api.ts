import {
  // Api as ApiGateway,
  StackContext,
  GraphQLApi,
  Config,
  use,
} from '@serverless-stack/resources';
import { Database } from './Database';

export function Api({ stack }: StackContext) {
  const db = use(Database);

  const api = new GraphQLApi(stack, 'Api', {
    defaults: {
      function: {
        permissions: [db.table, 'ses:SendEmail'],
        environment: { TABLE_NAME: db.table.tableName },
        timeout: 20,
      },
    },
    server: {
      handler: 'server.handler',
      memorySize: 1024,
      bundle: {
        format: 'esm',
      },
    },
  });

  new Config.Parameter(stack, 'API_URL', {
    value: api.url,
  });

  stack.addOutputs({
    API: api.url,
  });

  return api;
}
