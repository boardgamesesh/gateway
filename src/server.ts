import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { maxDepthRule } from '@escape.tech/graphql-armor-max-depth';
import { startServerAndCreateLambdaHandler } from '@as-integrations/aws-lambda';
import getResolvers from './getResolvers';
import setContext from './setContext';
import getSchema from './getSchema';

const createServer = () => {
  const typeDefs = getSchema();
  const resolvers = getResolvers();

  const server = new ApolloServer({
    schema: buildSubgraphSchema([
      {
        typeDefs,
        resolvers,
      },
    ]),

    validationRules: [maxDepthRule({ n: 7 })],
  });

  return server;
};

export const handler = startServerAndCreateLambdaHandler(createServer(), {
  context: setContext,
});
