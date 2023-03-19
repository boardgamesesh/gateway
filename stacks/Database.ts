import { Config, StackContext, Table } from '@serverless-stack/resources';
import { RemovalPolicy } from 'aws-cdk-lib';

export function Database({ stack }: StackContext) {
  const usersTable = new Table(stack, 'users', {
    fields: {
      id: 'string',
      email: 'string',
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

  const gameSessionTable = new Table(stack, 'game-sessions', {
    fields: {
      id: 'string',
      ownerId: 'string',
    },
    primaryIndex: {
      partitionKey: 'id',
    },
    globalIndexes: {
      ownerId: {
        partitionKey: 'ownerId',
      },
    },
    cdk: {
      table: {
        removalPolicy: stack.stage === 'dev' ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
      },
    },
  });

  const invitesTable = new Table(stack, 'invites', {
    fields: {
      id: 'string',
      userId: 'string',
      sessionId: 'string',
    },
    primaryIndex: {
      partitionKey: 'id',
    },
    globalIndexes: {
      userId: {
        partitionKey: 'userId',
      },
      sessionId: {
        partitionKey: 'sessionId',
      },
    },
    cdk: {
      table: {
        removalPolicy: stack.stage === 'dev' ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
      },
    },
  });

  return {
    usersTable,
    invitesTable,
    gameSessionTable,

    USERS_TABLE_NAME: new Config.Parameter(stack, 'USERS_TABLE_NAME', {
      value: usersTable.tableName,
    }),
    GAME_SESSIONS_TABLE_NAME: new Config.Parameter(stack, 'GAME_SESSION_TABLE_NAME', {
      value: gameSessionTable.tableName,
    }),
    INVITES_TABLE_NAME: new Config.Parameter(stack, 'INVITES_TABLE_NAME', {
      value: invitesTable.tableName,
    }),
  };
}
