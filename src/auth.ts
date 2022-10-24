import jwt from 'jsonwebtoken';
import getEnv from './getEnv';
import { GatewayEvent, Token } from './types';

type DecodedToken = {
  iat: number;
  exp: number;
} & Token;

export const createToken = (data: Token, expiresIn: string = '35d') =>
  jwt.sign(data, getEnv().jwtSecret, { expiresIn });

export const verifyToken = (token: string = 'bad token') =>
  jwt.verify(token, getEnv().jwtSecret) as DecodedToken;

const twoWeeks = 20 * 24 * 60 * 60 * 1000;

// sets the auth header so we can securely be logged in by the magic link
export default async (event: GatewayEvent) => {
  const setCookies = [] as any[];
  const setHeaders = [] as any[];
  let email;
  let type;
  let id;

  try {
    const { 'x-auth-token': token } = event.headers; // populate context with this
    const { exp, ...rest } = verifyToken(token);
    ({ email, type, id } = rest);

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
  } catch (err) {
    /* console.error('unauthenticated request', err); */
  }

  return {
    setCookies,
    setHeaders,
    event,
    email,
    type,
    id,
  };
};
