import {
  // Api as ApiGateway,
  StackContext,
  GraphQLApi,
  use,
} from '@serverless-stack/resources';
import * as awsSSM from 'aws-cdk-lib/aws-ssm';
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

  stack.addOutputs({
    API: api.url,
  });

  new awsSSM.StringParameter(stack, 'auth endpoint', {
    parameterName: `${stack.stage}/auth-endpoint`,
    description: `auth service endpoint for the ${stack.stage} stage`,
    stringValue: api.url,
  });

  return api;
}
