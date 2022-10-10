import { gql } from 'apollo-server-lambda';

export default () => gql`
  scalar DateTime
  scalar GraphQLJSONObject

  input SettingsInput {
    darkMode: Boolean
  }

  type Settings {
    darkMode: Boolean
  }

  type User @key(fields: "id") {
    id: ID!
    email: ID!
    name: String!
    settings: Settings
    createdAt: DateTime
    updatedAt: DateTime
  }

  input UpdateUserInput {
    id: String!
    name: String
    email: String
    settings: SettingsInput
  }

  type AffirmativeEmpty {
    ok: Boolean
  }

  type Query {
    user(id: ID!): User
  }

  type Mutation {
    sendMagicLink(email: String): AffirmativeEmpty
    updateUser(input: UpdateUserInput!): User
    createMagicUser(name: String!): User
  }
`;
