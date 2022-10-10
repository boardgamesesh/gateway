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
      handler: 'server.createServer',
      memorySize: 1024,
      bundle: {
        format: 'cjs',
      },
    },
  });

  // const api = new ApiGateway(stack, 'api', {
  //   defaults: {
  //     function: {
  //       permissions: [db.table],
  //       config: [db.TABLE_NAME],
  //     },
  //   },
  //   routes: {
  //     'POST /graphql': {
  //       type: 'pothos',
  //       function: {
  //         handler: 'functions/graphql/graphql.handler',
  //       },
  //       schema: 'services/functions/graphql/schema.ts',
  //       output: 'graphql/schema.graphql',
  //       commands: ['npx genql --output ./graphql/genql --schema ./graphql/schema.graphql --esm'],
  //     },
  //   },
  // });

  new Config.Parameter(stack, 'API_URL', {
    value: api.url,
  });

  stack.addOutputs({
    API: api.url,
  });

  return api;
}
