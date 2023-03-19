import { nanoid } from 'nanoid';
import { Context, Affirmative, IdObject } from '../types';
import type { UserType } from './MagicUser.model';
import { createToken, createCookie } from '../auth';
import { sendSignInEmail } from '../emailer';

export const queries = {
  // notice the id isn't coming from params anymore
  // the auth context will deliver their user id
  user: async (_: any, _args: any, { MagicUser, id }: Context) => {
    if (!id) throw new Error('Unable to get, not signed in');

    return MagicUser.get({ id });
  },
};

export const mutations = {
  sendMagicLink: async (
    _: any,
    { email }: { email: string },
    { MagicUser }: Context
  ): Promise<Affirmative> => {
    const secretToken = nanoid();

    let [user] = await MagicUser.query('email').eq(email).using('email').exec();

    if (!user) {
      user = await MagicUser.create({ email, type: 'magic', id: nanoid(), secretToken });
    } else {
      user = await MagicUser.update({ id: user.id, secretToken });
    }

    await sendSignInEmail({ email, userId: user.id, secretToken });

    return { ok: true };
  },

  // one of the few methods where id is sent in via mutation arguments
  signIn: async (
    _: any,
    { id, secretToken }: { id: string; secretToken: string },
    { MagicUser, headers }: Context
  ): Promise<UserType> => {
    const foundUser = await MagicUser.get(id as string);

    if (secretToken !== foundUser.secretToken) {
      throw new Error('Unable to sign in with invalid token');
    }

    const validToken = createToken({ email: foundUser.email, type: foundUser.type, id });
    // eslint-disable-next-line no-param-reassign
    headers.cookie = createCookie(validToken);

    return MagicUser.update({ id, secretToken: null });
  },

  signOut: () => ({ ok: true }), // no headers cookie, no auth

  updateUser: async (
    _: any,
    { input: partialUser }: { input: Partial<UserType> },
    { id, email, MagicUser }: Context
  ): Promise<UserType | undefined> => {
    if (partialUser.email) {
      const [existingUser] = await MagicUser.scan({ email: partialUser.email }).exec();
      if (existingUser && partialUser.email !== email) throw new Error('unable to change email');
    }

    return MagicUser.update({ id, ...partialUser });
  },
};

export const User = {
  // for finding out the info of the other users in the system
  __resolveReference: async ({ id }: IdObject, { MagicUser }: Context) => {
    const foundUser = await MagicUser.get(id);
    return { name: foundUser.name, id: foundUser.id };
  },
};
