export const queries = `#graphql
  invites(playerId: ID!): [GameSession]
`;

export const mutations = `#graphql
  createInvite(gameSessionId: ID!, id: String, email: String): Affirmative
  acceptInvite(id: ID!): GameSession
`;
