import { model } from 'dynamoose';
import type { BaseContext, ContextFunction } from '@apollo/server';
import type { LambdaContextFunctionArgument, MagicUserItem, Context } from './types';
import { MagicUserSchema } from './schemas';
import getAuth from './auth';
import getEnv from './getEnv';

// sets the auth header so we can securely be logged in by the magic link
const setContext: ContextFunction<[LambdaContextFunctionArgument], BaseContext> = async ({
  event,
  context,
}): Promise<Context> => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { setCookies, setHeaders, email, type, id } = await getAuth(event);
  const MagicUser = model<MagicUserItem>(getEnv().tableName, MagicUserSchema);

  return {
    ...context,
    MagicUser,
    setCookies,
    setHeaders,
    event,
    email,
    type,
    id,
  };
};

export default setContext;
