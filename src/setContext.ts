import { model } from 'dynamoose';
import type { BaseContext, ContextFunction } from '@apollo/server';
import type { LambdaContextFunctionArgument } from './types';
import UserModel, { type UserItem } from './users/MagicUser.model';
import InviteModel, { type InviteItem } from './invites/Invite.model';
import SessionModel, { type SessionItem } from './sessions/GameSession.model';
import getAuth from './auth';
import getEnv from './getEnv';

// sets the auth header so we can securely be logged in by the magic link
const setContext: ContextFunction<[LambdaContextFunctionArgument], BaseContext> = async ({
  event,
  context,
}) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { email, type, id } = await getAuth(event, context.headers);
  const MagicUser = model<UserItem>(getEnv().usersTableName, UserModel);
  const Invite = model<InviteItem>(getEnv().invitesTableName, InviteModel);
  const GameSession = model<SessionItem>(getEnv().sessionsTableName, SessionModel);

  return {
    ...context,
    MagicUser,
    Invite,
    GameSession,
    headers: context.headers,
    event,
    email,
    type,
    id,
  };
};

export default setContext;
