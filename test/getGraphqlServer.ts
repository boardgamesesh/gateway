import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginInlineTraceDisabled } from '@apollo/server/plugin/disabled';
import { buildSubgraphSchema } from '@apollo/subgraph';
import getResolvers from '../src/getResolvers';
import getTypeDefs from '../src/getSchema';

export default (context: any = {}) =>
  new ApolloServer<typeof context>({
    schema: buildSubgraphSchema([
      {
        typeDefs: getTypeDefs(),
        resolvers: getResolvers(),
      },
    ]),

    plugins: [ApolloServerPluginInlineTraceDisabled()],
  });
