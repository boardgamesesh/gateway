export const types = `#graphql
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
`;

export const queries = `#graphql
  user(id: ID!): User
`;

export const mutations = `#graphql
  updateUser(input: UpdateUserInput!): User
`;
