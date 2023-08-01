import { nanoid } from 'nanoid';
import { mutations as userMutations } from '../users/resolver';
import { Affirmative, Context } from '../types';

export type InviteInput = {
  gameSessionId: string;
  email?: string;
  id?: string;
};
export type InvitesInput = {
  gameSessionId: string;
  emails?: string[];
  ids?: string[];
};
type InviteUserType = InviteInput & { context: Context };

// private function, only exported for tests
export const inviteUser = async ({ id, email, gameSessionId, context }: InviteUserType) => {
  const { MagicUser, Invite } = context;

  let user = null;
  if (email) {
    [user] = await MagicUser.query('email').eq(email).using('email').exec();

    if (!user) {
      await userMutations.sendMagicLink(null, { email }, context);
      user = { id };
    }
  }

  return Invite.create({
    sessionId: gameSessionId,
    userId: user?.id || id,
    id: nanoid(),
  });
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
  ): Promise<Affirmative> {
    const { GameSession } = context;

    const invite = await inviteUser({ id, email, gameSessionId, context });

    await GameSession.update({ id: gameSessionId }, { $ADD: { invites: [invite.id] } } as any, {
      returnValues: 'ALL_NEW',
    });

    return { ok: true };
  },

  async createInvites(
    _: any,
    { gameSessionId, emails, ids }: InvitesInput,
    context: Context
  ): Promise<Affirmative[]> {
    const { GameSession } = context;

    const invitesToSend = [
      ...(emails || []).map((email: string) => ({ email, gameSessionId, context })),
      ...(ids || []).map((id: string) => ({ id, gameSessionId, context })),
    ];

    const invites = await Promise.allSettled(invitesToSend.map((invite) => inviteUser(invite)));

    await GameSession.update(
      { id: gameSessionId },
      { $ADD: { invites: invites.map((i) => i.status === 'fulfilled' && i.value.id) } } as any,
      {
        returnValues: 'ALL_NEW',
      }
    );

    return invites.map((invite, index: number) => {
      if (invite.status === 'fulfilled') {
        return { ok: true };
      }

      return { ...invites[index], ok: false, error: invite.reason };
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
