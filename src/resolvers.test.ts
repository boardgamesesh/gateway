import { getResolvers } from './resolvers';

describe('Resolvers', () => {
  const hashKey = 'threeve';

  describe('Queries', () => {
    it('getUser calls getItem on the dataSource with id', async () => {
      const id = '123';

      const dataSources = {
        userSource: {
          getItem: jest.fn(() => Promise.resolve({})),
        },
      };

      const {
        Query: { auth },
      } = getResolvers();

      await auth(null, { id }, { dataSources, hashKey });
      expect(dataSources.userSource.getItem).toHaveBeenCalledWith(id, {
        hashKey,
        withMetadata: true,
      });
    });

    it('getAllUsers calls getAll with { hashKey }', async () => {
      // the expectation is that most queries will be getting small groups related to a hash id
      // that hash id is the user id in this implementation
      const dataSources = {
        userSource: {
          getAll: jest.fn(() => Promise.resolve([])),
        },
      };

      const {
        Query: { getAllUsers },
      } = getResolvers();

      await getAllUsers(null, {}, { dataSources, hashKey });
      expect(dataSources.userSource.getAll).toHaveBeenCalledWith({ hashKey, withMetadata: true });
    });

    it('users calls query with { ...query }', async () => {
      const input = {
        name: { $contains: 'floop' },
      };
      // this is the slower dynamodb scan that has a more open query structure than `getAll`
      const dataSources = {
        userSource: {
          query: jest.fn(() => Promise.resolve([])),
        },
      };

      const {
        Query: { users },
      } = getResolvers();

      await users(null, { input }, { dataSources });
      expect(dataSources.userSource.query).toHaveBeenCalledWith(input, { withMetadata: true });
    });

    it('reference resolver calls getItem on the dataSource with { id }', async () => {
      const id = '123';

      const dataSources = {
        userSource: {
          getItem: jest.fn(() => Promise.resolve({})),
        },
      };

      const {
        Item: { __resolveReference },
      } = getResolvers();

      await __resolveReference({ id }, { dataSources, hashKey });
      expect(dataSources.userSource.getItem).toHaveBeenCalledWith(id, {
        hashKey,
        withMetadata: true,
      });
    });
  });

  describe('Mutations', () => {
    it('createUser calls createItem on the dataSource with { id, name }', async () => {
      const input = { id: '123', name: 'widget' };

      const dataSources = {
        userSource: {
          createItem: jest.fn(() => Promise.resolve({})),
        },
      };

      const {
        Mutation: { createUser },
      } = getResolvers();

      await createUser(null, { input }, { dataSources, hashKey });
      expect(dataSources.userSource.createItem).toHaveBeenCalledWith(input, {
        hashKey,
        withMetadata: true,
      });
    });

    it('updateUser calls updateItem on the dataSource with { id, name }', async () => {
      const input = { id: '123', name: 'widget' };

      const dataSources = {
        userSource: {
          updateItem: jest.fn(() => Promise.resolve({})),
        },
      };

      const {
        Mutation: { updateUser },
      } = getResolvers();

      await updateUser(null, { input }, { dataSources, hashKey });
      expect(dataSources.userSource.updateItem).toHaveBeenCalledWith(input, {
        hashKey,
        withMetadata: true,
      });
    });

    it('deleteUser calls deleteItem on the dataSource with id', async () => {
      const id = '123';

      const dataSources = {
        userSource: {
          deleteItem: jest.fn(() => Promise.resolve({})),
        },
      };

      const {
        Mutation: { deleteUser },
      } = getResolvers();

      await deleteUser(null, { id }, { dataSources, hashKey });
      expect(dataSources.userSource.deleteItem).toHaveBeenCalledWith(id, {
        hashKey,
        withMetadata: true,
      });
    });
  });
});
