import { ApolloServer } from 'apollo-server';
import { ApolloServerPluginInlineTraceDisabled } from 'apollo-server-core';
import { buildSubgraphSchema } from '@apollo/federation';
import DataBase from '@brightsole/sleep-talk';
import { getResolvers } from '../src/resolvers';
import getTypeDefs from '../src/schema';

jest.mock('@brightsole/sleep-talk');

export default (context = {}) => {
  const userSource = new DataBase({} as any);

  const server = new ApolloServer({
    schema: buildSubgraphSchema([
      {
        typeDefs: getTypeDefs(),
        resolvers: getResolvers(),
      } as any,
    ]),
    typeDefs: getTypeDefs(),
    resolvers: getResolvers(),
    dataSources: () => ({ userSource }),
    plugins: [ApolloServerPluginInlineTraceDisabled()],
    context,
  });

  return { server, userSource, context };
};
