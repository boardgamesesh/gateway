import jwt from 'jsonwebtoken';
import getEnv from './getEnv';
import { GatewayEvent, Token } from './types';

const twoWeeks = 20 * 24 * 60 * 60 * 1000;

export const createToken = (data: Token, expiresIn: string = '35d') =>
  jwt.sign(data, getEnv().jwtSecret, { expiresIn });

export const createCookie = (validToken: string) =>
  JSON.stringify({
    name: 'boardgamesesh auth cookie',
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
  jwt.verify(token, getEnv().jwtSecret) as jwt.JwtPayload;

const getCookieValue = (event: GatewayEvent) => {
  const [cookie] = (event.headers.cookie ?? '').split(';'); // populate context with this
  try {
    const cookieData = JSON.parse(cookie);
    return cookieData.value;
  } catch (_err) {
    return {};
  }
};

// sets the auth header so we can securely be logged in by the magic link
export default async (event: GatewayEvent, headers: { [name: string]: string }) => {
  let email;
  let type;
  let id;
  const token = getCookieValue(event);

  try {
    const verifiedData = await verifyToken(token);
    const { exp, ...rest } = verifiedData;
    ({ email, type, id } = rest);

    if (exp && exp * 1000 - Date.now() < twoWeeks) {
      // set a cookie if the token is near the expiry

      const validToken = createToken({ email, type, id });
      // eslint-disable-next-line no-param-reassign
      headers.cookie = createCookie(validToken);
    } else if (event.headers.cookie) {
      // eslint-disable-next-line no-param-reassign
      headers.cookie = event.headers.cookie;
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
