import { Config, StackContext, Table } from '@serverless-stack/resources';
import { RemovalPolicy } from 'aws-cdk-lib';

export function Database({ stack }: StackContext) {
  const table = new Table(stack, 'users-table', {
    fields: {
      id: 'string',
    },
    primaryIndex: {
      partitionKey: 'id',
    },
    globalIndexes: {
      email: {
        partitionKey: 'email',
      },
    },
    cdk: {
      table: {
        removalPolicy: stack.stage === 'dev' ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
      },
    },
  });

  return {
    table,
    TABLE_NAME: new Config.Parameter(stack, 'USERS_TABLE_NAME', {
      value: table.tableName,
    }),
  };
}
