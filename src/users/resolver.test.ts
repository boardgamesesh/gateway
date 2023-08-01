import getResolvers from '../getResolvers';

jest.mock('aws-sdk/clients/sesv2', () => jest.createMockFromModule('aws-sdk/clients/sesv2'));

describe('Resolvers', () => {
  describe('Query', () => {
    const { Query } = getResolvers();

    describe('user resolver', () => {
      const MagicUser = {} as any;

      it('returns the user when the pk is provpked in the context', async () => {
        const expectedUser = { pk: 'user-pk', email: 'user@test.com', type: 'magic' };

        MagicUser.get = jest.fn().mockResolvedValue(expectedUser);

        const user = await Query.user(null, null, {
          MagicUser,
          pk: 'user-pk',
        } as any);

        expect(user).toEqual(expectedUser);
        expect(MagicUser.get).toHaveBeenCalledWith({ pk: 'user-pk' });
      });

      it('throws an error when the pk is not provpked in the context', async () => {
        await expect(Query.user(null, null, { MagicUser } as any)).rejects.toThrow(
          'Unable to get, not signed in'
        );
      });
    });
  });

  // TODO: unskip once we know where the email goes
  describe.skip('Mutation', () => {
    const { Mutation } = getResolvers();
    describe('updateUser resolver', () => {
      it('updates with no scan if no email given', async () => {
        const pk = 'user-pk';
        const email = 'user@test.com';
        const user = { email, type: 'magic', pk, name: 'John Smith', age: 30 };
        const partialUser = { name: 'Jane Smith', age: 32 };
        const updatedUser = { ...user, ...partialUser };

        const MagicUser = {
          update: jest.fn().mockResolvedValue(updatedUser),
        } as any;

        const response = await Mutation.updateUser(null, { input: partialUser }, {
          pk,
          email,
          MagicUser,
        } as any);

        expect(response).toEqual(updatedUser);
        expect(MagicUser.update).toHaveBeenCalledWith({ pk, ...partialUser });
      });

      it('does not throw an error if trying to change the email to the same email', async () => {
        const pk = 'user-pk';
        const email = 'user@test.com';
        const user = { email, type: 'magic', pk, name: 'John Smith', age: 30 };
        const partialUser = { email };
        const updatedUser = { ...user, ...partialUser };

        const MagicUser = {
          scan: jest.fn().mockImplementation(() => ({
            exec: jest.fn().mockResolvedValue([{ email: 'other@test.com' }]),
          })),
          update: jest.fn().mockResolvedValue(updatedUser),
        } as any;

        const response = await Mutation.updateUser(null, { input: partialUser }, {
          pk,
          email,
          MagicUser,
        } as any);

        expect(response).toEqual(updatedUser);
        expect(MagicUser.scan).toHaveBeenCalledWith({ email: 'user@test.com' });
        expect(MagicUser.update).toHaveBeenCalledWith({ pk, ...partialUser });
      });

      it('throws an error if trying to change the email to an email that already exists', async () => {
        const pk = 'user-pk';
        const email = 'user@test.com';
        const partialUser = { email: 'other@test.com' };

        const MagicUser = {
          scan: jest.fn().mockImplementation(() => ({
            exec: jest.fn().mockResolvedValue([{ email: 'other@test.com' }]),
          })),
        } as any;

        await expect(
          Mutation.updateUser(null, { input: partialUser }, { pk, email, MagicUser } as any)
        ).rejects.toThrow('unable to change email');
      });
    });
  });

  describe.skip('User', () => {
    const { User } = getResolvers();

    describe('__resolveReference resolver', () => {
      it('resolves a reference to a user and returns their name and pk', async () => {
        const pk = 'user-pk';
        const user = { email: 'user@test.com', type: 'magic', pk, name: 'John Smith' };

        const MagicUser = {
          get: jest.fn().mockResolvedValue(user),
        } as any;

        // eslint-disable-next-line no-underscore-dangle
        const response = await User.__resolveReference(
          { pk } as any,
          {
            MagicUser,
          } as any
        );

        // NO OTHER PROPERTIES WILL COME THROUGH EVEN IF ASKED FOR
        expect(response).toEqual({ name: user.name, pk: user.pk });
        expect(MagicUser.get).toHaveBeenCalledWith(pk);
      });
    });
  });
});
