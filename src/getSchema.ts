import { gql } from 'graphql-tag';

export default () => gql`
  scalar DateTime
  scalar JSONObject

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
    location: String
    settings: Settings
    createdAt: DateTime
    updatedAt: DateTime
  }

  input UpdateUserInput {
    id: String!
    name: String
    email: String
    location: String
    settings: SettingsInput
  }

  type AffirmativeEmpty {
    ok: Boolean
  }

  type Query {
    user(id: ID!): User
  }

  type Mutation {
    sendMagicLink(email: String!): AffirmativeEmpty
    updateUser(input: UpdateUserInput!): User
    signIn(id: ID!, secretToken: ID!): User
    signOut: AffirmativeEmpty
  }
`;
