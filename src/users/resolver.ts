import { Context, IdObject } from '../types';
import type { UserType } from './MagicUser.model';

export const queries = {
  // notice the id isn't coming from params anymore
  // the auth context will deliver their user id
  user: async (_: any, _args: any, { MagicUser, pk }: Context) => {
    if (!pk) throw new Error('Unable to get, not signed in');

    return MagicUser.get({ pk });
  },
};

export const mutations = {
  updateUser: async (
    _: any,
    { input: partialUser }: { input: Partial<UserType> },
    { pk, email, MagicUser }: Context
  ): Promise<UserType | undefined> => {
    if (partialUser.email) {
      const [existingUser] = await MagicUser.scan({ email: partialUser.email }).exec();
      if (existingUser && partialUser.email !== email) throw new Error('unable to change email');
    }

    return MagicUser.update({ pk, ...partialUser });
  },
};

export const User = {
  // for finding out the info of the other users in the system
  __resolveReference: async ({ pk }: IdObject, { MagicUser }: Context) => {
    if (!pk) return {};

    const foundUser = await MagicUser.get(pk);
    return { name: foundUser.name, pk: foundUser.pk };
  },
};
