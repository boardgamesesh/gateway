import { model } from 'dynamoose';
import type { BaseContext, ContextFunction } from '@apollo/server';
import type { LambdaContextFunctionArgument, MagicUserItem } from './types';
import { MagicUserSchema } from './schemas';
import getAuth from './auth';
import getEnv from './getEnv';

// sets the auth header so we can securely be logged in by the magic link
const setContext: ContextFunction<[LambdaContextFunctionArgument], BaseContext> = async ({
  event,
  context,
}) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { email, type, id } = await getAuth(event, context.headers);
  const MagicUser = model<MagicUserItem>(getEnv().tableName, MagicUserSchema);

  return {
    ...context,
    MagicUser,
    headers: context.headers,
    event,
    email,
    type,
    id,
  };
};

export default setContext;
