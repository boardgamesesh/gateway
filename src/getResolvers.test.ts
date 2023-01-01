import * as SESV2 from 'aws-sdk/clients/sesv2';
import getResolvers from './getResolvers';

jest.mock('aws-sdk/clients/sesv2', () => jest.createMockFromModule('aws-sdk/clients/sesv2'));

describe('Resolvers', () => {
  describe('Query', () => {
    const { Query } = getResolvers();

    describe('user resolver', () => {
      const MagicUser = {} as any;

      it('returns the user when the id is provided in the context', async () => {
        const expectedUser = { id: 'user-id', email: 'user@test.com', type: 'magic' };

        MagicUser.get = jest.fn().mockResolvedValue(expectedUser);

        const user = await Query.user(null, null, {
          MagicUser,
          id: 'user-id',
          headers: {},
          event: {},
        });

        expect(user).toEqual(expectedUser);
        expect(MagicUser.get).toHaveBeenCalledWith({ id: 'user-id' });
      });

      it('throws an error when the id is not provided in the context', async () => {
        await expect(Query.user(null, null, { MagicUser, headers: {}, event: {} })).rejects.toThrow(
          'Unable to get, not signed in'
        );
      });
    });
  });

  describe('Mutation', () => {
    const { Mutation } = getResolvers();

    describe('sendMagicLink resolver', () => {
      const MagicUser = {} as any;

      it('creates a new user with a secret token when the email does not exist in the database', async () => {
        const email = 'new-user@test.com';
        const secretToken = 'secret-token';
        const newUser = { email, type: 'magic', id: 'new-user-id', secretToken };
        const expectedResponse = { ok: true };

        MagicUser.query = jest.fn().mockImplementation(() => ({
          eq: jest.fn().mockImplementation(() => ({
            using: jest.fn().mockImplementation(() => ({
              exec: jest.fn().mockResolvedValue([]),
            })),
          })),
        }));
        MagicUser.create = jest.fn().mockResolvedValue(newUser);
        (SESV2 as any).mockImplementation(() => ({
          sendEmail: jest
            .fn()
            .mockImplementation(() => ({ promise: jest.fn().mockResolvedValue({}) })),
        }));

        const response = await Mutation.sendMagicLink(
          null,
          { email },
          { MagicUser, headers: {}, event: {} }
        );

        expect(response).toEqual(expectedResponse);
        expect(MagicUser.query).toHaveBeenCalledWith('email');
        expect(MagicUser.create).toHaveBeenCalledWith({
          email,
          type: 'magic',
          id: expect.any(String), // ignores passed in ids
          secretToken: expect.any(String),
        });
      });

      it('updates an existing user with a secret token when the email exists in the database', async () => {
        const email = 'existing-user@test.com';
        const secretToken = 'secret-token';
        const existingUser = {
          email,
          type: 'magic',
          id: 'existing-user-id',
          secretToken: 'old-secret-token',
        };
        const updatedUser = { ...existingUser, secretToken };
        const expectedResponse = { ok: true };

        MagicUser.query = jest.fn().mockImplementation(() => ({
          eq: jest.fn().mockImplementation(() => ({
            using: jest.fn().mockImplementation(() => ({
              exec: jest.fn().mockResolvedValue([existingUser]),
            })),
          })),
        }));
        MagicUser.update = jest.fn().mockResolvedValue(updatedUser);
        (SESV2 as any).mockImplementation(() => ({
          sendEmail: jest
            .fn()
            .mockImplementation(() => ({ promise: jest.fn().mockResolvedValue({}) })),
        }));

        const response = await Mutation.sendMagicLink(
          null,
          { email },
          { MagicUser, headers: {}, event: {} }
        );

        expect(response).toEqual(expectedResponse);
        expect(MagicUser.query).toHaveBeenCalledWith('email');
        expect(MagicUser.update).toHaveBeenCalledWith({
          id: 'existing-user-id',
          secretToken: expect.any(String),
        });
      });
    });

    describe('signIn resolver', () => {
      it('signs in a user and sets a cookie in the headers when the secret token is valid', async () => {
        const id = 'user-id';
        const secretToken = 'secret-token';
        const user = { email: 'user@test.com', type: 'magic', id, secretToken };
        const headers = {} as any;
        const updatedUser = { ...user, secretToken: null };

        const MagicUser = {
          get: jest.fn().mockResolvedValue(user),
          update: jest.fn().mockResolvedValue(updatedUser),
        } as any;

        const response = await Mutation.signIn(
          null,
          { id, secretToken },
          { MagicUser, headers, event: {} }
        );

        expect(response).toEqual(updatedUser);
        expect(MagicUser.get).toHaveBeenCalledWith(id);
        expect(MagicUser.update).toHaveBeenCalledWith({ id, secretToken: null });
        expect(headers.cookie).toEqual(expect.any(String));
        expect(typeof JSON.parse(headers.cookie)).toBe('object');
      });

      it('throws an error when the secret token is invalid', async () => {
        const id = 'user-id';
        const secretToken = 'invalid-secret-token';
        const user = { email: 'user@test.com', type: 'magic', id, secretToken: 'secret-token' };

        const MagicUser = {
          get: jest.fn().mockResolvedValue(user),
        } as any;

        await expect(
          Mutation.signIn(null, { id, secretToken }, { MagicUser, headers: {}, event: {} })
        ).rejects.toThrow('Unable to sign in with invalid token');
      });
    });

    describe('updateUser resolver', () => {
      it('updates with no scan if no email given', async () => {
        const id = 'user-id';
        const email = 'user@test.com';
        const user = { email, type: 'magic', id, name: 'John Smith', age: 30 };
        const partialUser = { name: 'Jane Smith', age: 32 };
        const updatedUser = { ...user, ...partialUser };

        const MagicUser = {
          update: jest.fn().mockResolvedValue(updatedUser),
        } as any;

        const response = await Mutation.updateUser(
          null,
          { input: partialUser },
          { id, email, MagicUser, event: {}, headers: {} }
        );

        expect(response).toEqual(updatedUser);
        expect(MagicUser.update).toHaveBeenCalledWith({ id, ...partialUser });
      });

      it('does not throw an error if trying to change the email to the same email', async () => {
        const id = 'user-id';
        const email = 'user@test.com';
        const user = { email, type: 'magic', id, name: 'John Smith', age: 30 };
        const partialUser = { email };
        const updatedUser = { ...user, ...partialUser };

        const MagicUser = {
          scan: jest.fn().mockImplementation(() => ({
            exec: jest.fn().mockResolvedValue([{ email: 'other@test.com' }]),
          })),
          update: jest.fn().mockResolvedValue(updatedUser),
        } as any;

        const response = await Mutation.updateUser(
          null,
          { input: partialUser },
          { id, email, MagicUser, event: {}, headers: {} }
        );

        expect(response).toEqual(updatedUser);
        expect(MagicUser.scan).toHaveBeenCalledWith({ email: 'user@test.com' });
        expect(MagicUser.update).toHaveBeenCalledWith({ id, ...partialUser });
      });

      it('throws an error if trying to change the email to an email that already exists', async () => {
        const id = 'user-id';
        const email = 'user@test.com';
        const partialUser = { email: 'other@test.com' };

        const MagicUser = {
          scan: jest.fn().mockImplementation(() => ({
            exec: jest.fn().mockResolvedValue([{ email: 'other@test.com' }]),
          })),
        } as any;

        await expect(
          Mutation.updateUser(
            null,
            { input: partialUser },
            { id, email, MagicUser, event: {}, headers: {} }
          )
        ).rejects.toThrow('unable to change email');
      });
    });
  });

  describe('User', () => {
    const { User } = getResolvers();

    describe('__resolveReference resolver', () => {
      it('resolves a reference to a user and returns their name and id', async () => {
        const id = 'user-id';
        const user = { email: 'user@test.com', type: 'magic', id, name: 'John Smith' };

        const MagicUser = {
          get: jest.fn().mockResolvedValue(user),
        } as any;

        // eslint-disable-next-line no-underscore-dangle
        const response = await User.__resolveReference(
          { id },
          { MagicUser, headers: {}, event: {} }
        );

        // NO OTHER PROPERTIES WILL COME THROUGH EVEN IF ASKED FOR
        expect(response).toEqual({ name: user.name, id: user.id });
        expect(MagicUser.get).toHaveBeenCalledWith(id);
      });
    });
  });
});
