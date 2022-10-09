import { Config, StackContext, Table } from '@serverless-stack/resources';

export function Database({ stack }: StackContext) {
  const table = new Table(stack, 'table', {
    fields: {
      id: 'string',
    },
    primaryIndex: {
      partitionKey: 'id',
    },
  });

  return {
    table,
    TABLE_NAME: new Config.Parameter(stack, 'users', {
      value: table.tableName,
    }),
  };
}
