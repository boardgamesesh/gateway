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
        permissions: [db.usersTable, db.gameSessionTable, db.invitesTable, 'ses:SendEmail'],
        environment: {
          USERS_TABLE_NAME: db.usersTable.tableName,
          INVITES_TABLE_NAME: db.invitesTable.tableName,
          GAME_SESSIONS_TABLE_NAME: db.gameSessionTable.tableName,
        },
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

  new awsSSM.StringParameter(stack, 'gateway endpoint', {
    parameterName: `/${stack.stage}/gateway-endpoint`,
    description: `gateway service endpoint for the ${stack.stage} stage`,
    stringValue: api.url,
  });

  return api;
}
