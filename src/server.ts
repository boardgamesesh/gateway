import * as cors from 'cors';
import * as express from 'express';
import * as compression from 'compression';
import * as depthLimit from 'graphql-depth-limit';
import { ApolloServer } from 'apollo-server-lambda';
import { buildSubgraphSchema } from '@apollo/federation';
import { getResolvers } from './resolvers';
import getUserDatabase from './database';
import getSchema from './schema';
import getRoutes from './routes';
import { User } from './types';

const httpHeadersPlugin = require('apollo-server-plugin-http-headers');

const createServer = (userSource: any) => {
  const typeDefs = getSchema();
  const resolvers = getResolvers();

  // const permissions = getPermissions();

  return new ApolloServer({
    schema: buildSubgraphSchema([
      {
        typeDefs,
        resolvers,
      } as any,
    ]),
    // permissions,

    plugins: [httpHeadersPlugin],
    context: async ({ event, context }) => {
      context.callbackWaitsForEmptyEventLoop = false;

      const { 'x-auth-token': token, 'x-user-id': hashKey } = event.headers; // populate context with this
      return {
        setHeaders: [],
        setCookies: [],
        hashKey,
        token,
        event,
      };
    },
    validationRules: [depthLimit(7)],
    dataSources: () => ({ userSource }),
  });
};

export default () => {
  const userSource = getUserDatabase<User>();

  const server = createServer(userSource);

  return server.createHandler({
    expressAppFromMiddleware(middleware) {
      const app = express();

      app.use(cors());
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));

      app.use('/users', getRoutes(userSource));

      // if you ever wanted to handle gql uploads
      // app.use(graphqlUploadExpress());

      app.use(middleware);

      app.use(compression());

      return app;
    },
  });
};
