import { gql } from 'graphql-tag';
import {
  types as userTypes,
  queries as userQueries,
  mutations as userMutations,
} from './users/schema';
import {
  types as sessionTypes,
  queries as sessionQueries,
  mutations as sessionMutations,
} from './sessions/schema';
import { queries as inviteQueries, mutations as inviteMutations } from './invites/schema';

export default () => gql`
  scalar DateTime
  scalar JSONObject

  type Affirmative {
    ok: Boolean
    id: String
    email: String
    error: String
  }

  ${userTypes}
  ${sessionTypes}

  type Query {
    ${userQueries}
    ${sessionQueries}
    ${inviteQueries}
  }

  type Mutation {
    ${userMutations}
    ${sessionMutations}
    ${inviteMutations}
  }
`;
