import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginInlineTraceDisabled } from '@apollo/server/plugin/disabled';
import { buildSubgraphSchema } from '@apollo/subgraph';
import getResolvers from '../src/getResolvers';
import getTypeDefs from '../src/getSchema';
import { Context } from '../src/types';

export default () =>
  new ApolloServer<Context>(
    {
      schema: buildSubgraphSchema([
        {
          typeDefs: getTypeDefs(),
          resolvers: getResolvers(),
        },
      ]),

      plugins: [ApolloServerPluginInlineTraceDisabled()],
    }
    // { context: () => context }
  );
