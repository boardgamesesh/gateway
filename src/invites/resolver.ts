import { nanoid } from 'nanoid';
import { mutations as userMutations } from '../users/resolver';
import { SessionType } from '../sessions/GameSession.model';
import { Context } from '../types';

export type InviteInput = {
  gameSessionId: string;
  email?: string;
  id?: string;
};

export const queries = {
  async invites(_: any, { playerId }: { playerId: string }, context: Context) {
    const { GameSession, Invite } = context;

    const invites = await Invite.query('userId').eq(playerId).using('userId').exec();

    return GameSession.batchGet(invites.map((invite) => invite.sessionId));
  },
};

export const mutations = {
  async createInvite(
    _: any,
    { gameSessionId, email, id }: InviteInput,
    context: Context
  ): Promise<SessionType> {
    const { GameSession, Invite, MagicUser } = context;

    let user = null;
    if (email) {
      [user] = await MagicUser.query('email').eq(email).using('email').exec();

      if (!user) {
        await userMutations.sendMagicLink(_, { email }, context);
        user = { id };
      }
    }

    const invite = await Invite.create({
      sessionId: gameSessionId,
      userId: user?.id || id,
      id: nanoid(),
    });

    return GameSession.update({ id: gameSessionId }, { $ADD: { invites: [invite.id] } } as any, {
      returnValues: 'ALL_NEW',
    });
  },

  acceptInvite: async (_: any, { id }: { id: string }, context: Context) => {
    const { GameSession, Invite, MagicUser } = context;

    const invite = await Invite.get(id);

    const gameSession = await GameSession.update(
      { id: invite.sessionId },
      {
        $ADD: { playerIds: [invite.userId] },
      } as any,
      { returnValues: 'ALL_NEW' }
    );

    await Invite.delete(id);
    await MagicUser.update({ id: invite.userId }, {
      $ADD: { sessionIds: [gameSession.id] },
    } as any);

    return gameSession;
  },
};
