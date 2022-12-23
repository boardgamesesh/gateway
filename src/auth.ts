import jwt from 'jsonwebtoken';
import getEnv from './getEnv';
import { GatewayEvent, Token } from './types';

type DecodedToken = {
  iat: number;
  exp: number;
} & Token;

const twoWeeks = 20 * 24 * 60 * 60 * 1000;

export const createToken = (data: Token, expiresIn: string = '35d') =>
  jwt.sign(data, getEnv().jwtSecret, { expiresIn });

export const createCookie = (validToken: string) =>
  JSON.stringify({
    name: 'auth cookie',
    value: validToken,
    options: {
      expires: new Date(Date.now() + twoWeeks),
      domain: 'boardgamesesh.com',
      maxAge: twoWeeks / 1000,
      httpOnly: true,
      sameSite: true,
      secure: true,
      path: '/',
    },
  });

export const verifyToken = (token: string = 'bad token') =>
  jwt.verify(token, getEnv().jwtSecret) as DecodedToken;

// sets the auth header so we can securely be logged in by the magic link
export default async (event: GatewayEvent, headers: { [name: string]: string }) => {
  let email;
  let type;
  let id;

  try {
    const [token] = (event.headers.cookie ?? '').split(';'); // populate context with this
    const { exp, ...rest } = verifyToken(token);
    ({ email, type, id } = rest);

    if (exp * 1000 - Date.now() < twoWeeks) {
      // set a cookie if the token is near the expiry

      const validToken = createToken({ email, type, id });
      // eslint-disable-next-line no-param-reassign
      headers.cookie = createCookie(validToken);
    }
  } catch (err) {
    /* console.error('unauthenticated request', err); */
  }

  return {
    headers,
    event,
    email,
    type,
    id,
  };
};
