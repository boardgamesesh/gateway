import auth, { createToken, createCookie, verifyToken } from './auth';

describe('auth', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  const now = new Date();

  beforeEach(() => {
    jest.setSystemTime(now);
  });

  it('encodes and decodes reversibly using createToken & verifyToken', () => {
    const token = createToken({ email: 'user@example.com', id: '123', type: 'magic' });
    expect(verifyToken(token)).toEqual({
      email: 'user@example.com',
      exp: Math.floor(now.valueOf() / 1000) + 35 * 60 * 60 * 24,
      iat: Math.floor(now.valueOf() / 1000),
      id: '123',
      type: 'magic',
    });
  });

  it('should parse and pass through the auth header if it is current', async () => {
    const validToken = createToken({ email: 'user@example.com', id: '123', type: 'magic' });
    const event = {
      headers: {
        cookie: createCookie(validToken),
      },
    } as any;
    const headers = {} as any;

    jest.advanceTimersByTime(5);
    const result = await auth(event, headers);

    expect(result).toEqual({
      email: 'user@example.com',
      type: 'magic',
      id: '123',
      event: expect.any(Object),
      headers: expect.any(Object),
    });

    expect(event.headers.cookie).toEqual(headers.cookie);
  });

  it('should set a new cookie if token is near expiry', async () => {
    const validToken = createToken({ email: 'user@example.com', id: '123', type: 'magic' });
    const event = {
      headers: {
        cookie: createCookie(validToken),
      },
    } as any;
    const headers = {} as any;

    jest.advanceTimersByTime(20 * 24 * 60 * 60 * 1000);
    const result = await auth(event, headers);

    expect(result).toEqual({
      email: 'user@example.com',
      type: 'magic',
      id: '123',
      event: expect.any(Object),
      headers: expect.any(Object),
    });

    // brand new cookie baybeeeee
    expect(event.headers.cookie).not.toEqual(headers.cookie);
  });

  it('should return empty object if token is invalid', async () => {
    const event = {
      headers: {
        cookie: 'token=invalid;',
      },
    } as any;
    const headers = {} as any;
    const result = await auth(event, headers);

    expect(result.email).toBeUndefined();
    expect(result.type).toBeUndefined();
    expect(result.id).toBeUndefined();
    expect(result.headers.cookie).toBeUndefined();
  });

  it('should also return empty auth if no token is present in headers', async () => {
    const event = {
      headers: {},
    } as any;
    const headers = {} as any;
    const result = await auth(event, headers);

    expect(result.email).toBeUndefined();
    expect(result.type).toBeUndefined();
    expect(result.id).toBeUndefined();
    expect(result.headers.cookie).toBeUndefined();
  });
});
