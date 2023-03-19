export const types = `#graphql
type Game {
  name: String
  links: [String]
}

type PlayerScore {
  userId: ID!
  points: Int
  position: Int
}

input PlayerScoreInput {
  userId: ID!
  points: Int
  position: Int
}

type GameResult {
  winnerIds: [ID!]
  gameName: String
  scores: [PlayerScore]
}

input GameResultInput {
  winnerIds: [ID!]
  gameName: String
  scores: [PlayerScoreInput]
}

type GameSession @key(fields: "id") {
  id: ID!
  ownerId: ID!
  games: [Game]
  date: DateTime
  inviteIds: [ID!]
  playerIds: [ID!]
  location: String
  results: [GameResult]
  createdAt: DateTime
  updatedAt: DateTime
}

input GameInput {
  name: String
  links: [String]
}

input UpdateGameSessionInput {
  id: ID!
  date: DateTime
  ownerId: String
  location: String
  games: [GameInput]
  description: String
}

input FinishGameSessionInput {
  id: ID!
  nextSessionDate: DateTime
  results: [GameResultInput]
}

input SessionQuery {
  limit: Int
  ownerId: String
  finished: Boolean
}
`;

export const queries = `#graphql
  gameSession(id: ID!): GameSession
  gameSessions(query: SessionQuery!): [GameSession]
`;

export const mutations = `#graphql
  updateGameSession(input: UpdateGameSessionInput!): GameSession
  finishGameSession(input: FinishGameSessionInput!): GameSession
  createGameSession(name: String, description: String): GameSession
`;
