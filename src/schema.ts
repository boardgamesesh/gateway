import { gql } from 'apollo-server-lambda';

export default () => gql`
  scalar DateTime
  scalar JSONObject

  type User @key(fields: "id") {
    id: ID!
    name: String!
    createdAt: DateTime
    updatedAt: DateTime
  }

  input CreateUserInput {
    name: String!
  }

  input UpdateUserInput {
    id: String!
    name: String!
  }

  input DeleteUserInput {
    id: String!
  }

  type UserPayload {
    consumedCapacity: Float
    item: User
  }

  type UserListPayload {
    consumedCapacity: Float
    lastScannedId: ID
    items: [User]
    count: Int
  }

  type Query {
    auth(id: ID!): UserPayload
    users(input: JSONObject): UserListPayload
    getAllUsers: UserListPayload
  }

  type Mutation {
    createUser(input: CreateUserInput!): UserPayload
    updateUser(input: UpdateUserInput!): UserPayload
    deleteUser(id: ID!): UserPayload
  }
`;
