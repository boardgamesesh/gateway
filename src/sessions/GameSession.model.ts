import { Schema } from 'dynamoose';
import type { Item } from 'dynamoose/dist/Item';

export type Result = {
  winnerIds: string[];
  gameName: string;
  scores: number[];
};
export type Game = {
  name: string;
  links: string[];
};
export type SessionType = {
  ownerId: string;
  playerIds: string[];
  location: string;
  results: Result[];
  date: string;
  games: Game[];
  createdAt: string;
  updatedAt: string;
  id: string;
};
export type SessionItem = Item & SessionType;

export default new Schema({
  ownerId: { type: String, index: { name: 'ownerId', type: 'global' } },
  playerIds: { type: Array, schema: [String] },
  date: { type: Date },
  games: {
    type: Array,
    schema: [
      {
        name: { type: String },
        links: { type: Array, schema: [String] },
      },
    ],
  },
  location: { type: String },
  results: {
    type: Array,
    schema: [
      {
        winnerIds: { type: Array, schema: [String] },
        gameName: { type: String },
        scores: { type: Array, schema: [Number] },
      },
    ],
  },
  id: { type: String, hashKey: true, required: true },
});
