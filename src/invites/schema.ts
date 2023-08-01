export const queries = `#graphql
  invites(playerId: ID!): [GameSession]
`;

export const mutations = `#graphql
  createInvites(gameSessionId: ID!, emails: [String], ids: [String]): [Affirmative]
  createInvite(gameSessionId: ID!, id: String, email: String): Affirmative
  acceptInvite(id: ID!): GameSession
`;
