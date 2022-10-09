import depthLimit from 'graphql-depth-limit';
import { ApolloServer } from 'apollo-server-lambda';
import { buildSubgraphSchema } from '@apollo/federation';
import { setContext } from './auth';
import { getResolvers } from './resolvers';
import initialiseUserDatabase from './database';
import getSchema from './schema';

// still no types for this library
const httpHeadersPlugin = require('apollo-server-plugin-http-headers');

export const createServer = () => {
  const typeDefs = getSchema();
  const resolvers = getResolvers();
  const userSource = initialiseUserDatabase();

  const server = new ApolloServer({
    schema: buildSubgraphSchema([
      {
        typeDefs,
        resolvers,
      } as any,
    ]),

    plugins: [httpHeadersPlugin],
    context: ({ event, context }) => setContext({ event, context }),
    validationRules: [depthLimit(7)],
    dataSources: () => ({ userSource }),
  });

  return server.createHandler();
};
