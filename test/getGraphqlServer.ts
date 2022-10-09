import { ApolloServer } from 'apollo-server';
import { ApolloServerPluginInlineTraceDisabled } from 'apollo-server-core';
import { buildSubgraphSchema } from '@apollo/federation';
import dynamoose from 'dynamoose';
import { getResolvers } from '../src/resolvers';
import getTypeDefs from '../src/schema';
import { User } from '../src/models';

export default (context = {}) => {
  dynamoose.aws.ddb.local();
  const userSource = new dynamoose.Table('Users', [User]);

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
