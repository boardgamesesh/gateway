import { GraphQLDateTime, GraphQLJSONObject } from 'graphql-scalars';
import { User, mutations as userMutations, queries as userQueries } from './users/resolver';
import { mutations as inviteMutations, queries as inviteQueries } from './invites/resolver';
import {
  GameSession,
  mutations as sessionMutations,
  queries as sessionQueries,
} from './sessions/resolver';

export default () => ({
  Query: {
    ...userQueries,
    ...inviteQueries,
    ...sessionQueries,
  },

  Mutation: {
    ...userMutations,
    ...inviteMutations,
    ...sessionMutations,
  },

  User,
  GameSession,

  DateTime: GraphQLDateTime,
  JSONObject: GraphQLJSONObject,
});
