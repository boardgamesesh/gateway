import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Query } from '@brightsole/sleep-talk';
import { User, Input, IdObject, GenericUserPayload, Context } from './types';

export const getResolvers = () => ({
  Query: {
    user: async (_: any, args: IdObject, { dataSources, hashKey }: Context) =>
      dataSources.userSource.getItem(args.id, { hashKey, withMetadata: true }),
    users: async (_: any, args: { input: Query }, { dataSources }: Context) =>
      dataSources.userSource.query(args.input, { withMetadata: true }),
    getAllUsers: async (_: any, __: any, { dataSources, hashKey }: Context) =>
      dataSources.userSource.getAll({ hashKey, withMetadata: true }),
  },

  Mutation: {
    createUser: (
      _: any,
      args: Input,
      { dataSources, hashKey }: Context
    ): Promise<GenericUserPayload> =>
      dataSources.userSource.createItem(args.input, { hashKey, withMetadata: true }),
    updateUser: (
      _: any,
      args: Input,
      { dataSources, hashKey }: Context
    ): Promise<GenericUserPayload> =>
      dataSources.userSource.updateItem(args.input, { hashKey, withMetadata: true }),
    deleteUser: (
      _: any,
      args: IdObject,
      { dataSources, hashKey }: Context
    ): Promise<GenericUserPayload> =>
      dataSources.userSource.deleteItem(args.id, { hashKey, withMetadata: true }),
  },

  User: {
    __resolveReference: ({ id }: Partial<User>, { dataSources, hashKey }: Context) =>
      dataSources.userSource.getItem(id, { hashKey, withMetadata: true }),
  },

  DateTime: GraphQLDateTime,
  JSONObject: GraphQLJSONObject,
});
