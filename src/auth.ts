import jwt from 'jsonwebtoken';
import getEnv from './env';

import { Token, Context } from './types';

type DecodedToken = {
  iat: number;
  exp: number;
} & Token;

export const createToken = (data: Token, expiresIn: string = '35d') =>
  jwt.sign(data, getEnv().jwtSecret, { expiresIn });

export const verifyToken = (token: string) => jwt.verify(token, getEnv().jwtSecret) as DecodedToken;

const twoWeeks = 20 * 24 * 60 * 60 * 1000;

// sets the auth header so we can securely be logged in by the magic link
export const setContext = async ({ event, context }: { event: any; context: Context }) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { 'x-auth-token': token } = event.headers; // populate context with this
  const { email, type, id, exp } = verifyToken(token);

  const setCookies = [];

  if (exp * 1000 - Date.now() < twoWeeks) {
    // set a cookie if the token is near the expiry

    const validToken = createToken({ email, type, id });
    setCookies.push({
      name: 'auth cookie',
      value: validToken,
      options: {
        expires: new Date(Date.now() + twoWeeks),
        domain: 'boarganise.com',
        maxAge: twoWeeks / 1000,
        httpOnly: true,
        sameSite: true,
        secure: true,
        path: '/',
      },
    });
  }

  return {
    setCookies,
    event,
    email,
    type,
    id,
  };
};
