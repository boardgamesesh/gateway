import { ApolloServer } from 'apollo-server-lambda';
import { buildSubgraphSchema } from '@apollo/federation';
import { maxDepthRule } from '@escape.tech/graphql-armor-max-depth';
import initialiseUserDatabase from './database';
import { getResolvers } from './resolvers';
import { setContext } from './auth';
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
      },
    ]),

    plugins: [httpHeadersPlugin],
    context: ({ event, context }) => setContext({ event, context }),
    validationRules: [maxDepthRule({ n: 7 })],
    dataSources: () => ({ userSource }),
  });

  return server.createHandler();
};
