import { Condition } from 'dynamoose';
import { nanoid } from 'nanoid';
import { type SessionType } from './GameSession.model';
import { Context, IdObject } from '../types';

type GameSessionQuery = {
  ownerId: string;
};

export const queries = {
  gameSession: async (_: any, { id }: { id: string }, { GameSession }: Context) =>
    GameSession.get({ id }),
  gameSessions: async (_: any, { ownerId }: GameSessionQuery, { GameSession }: Context) =>
    GameSession.query('ownerId').eq(ownerId).using('ownerId').exec(),
};

export const mutations = {
  createGameSession: async (
    _: any,
    partialGameSession: Partial<SessionType>,
    { id, GameSession }: Context
  ): Promise<SessionType> => {
    if (!id) throw new Error('Unauthorized');

    return GameSession.create({ ...partialGameSession, id: nanoid(), ownerId: id });
  },

  updateGameSession: async (
    _: any,
    { input: partialGameSession }: { input: Partial<SessionType> },
    { id, GameSession }: Context
  ): Promise<SessionType> => {
    try {
      const updatedItem = await GameSession.update(
        { id: partialGameSession.id },
        { ...partialGameSession, ownerId: id }, // don't let the user change the owner
        {
          condition: new Condition().where('ownerId').eq(id).and().attribute('id').exists(),
          returnValues: 'ALL_NEW',
        }
      );
      return updatedItem; // you must await, otherwise the error will be swallowed
    } catch (error: any) {
      if (error.code === 'ConditionalCheckFailedException') {
        throw new Error('Item deleted or owned by another user');
      }
      throw error;
    }
  },
};

export const GameSession = {
  __resolveReference: async ({ id }: IdObject, { GameSession: Session }: Context) =>
    Session.get(id),
};
