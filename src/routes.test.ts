import getRestServer from '../test/getRestServer';

// INTEGRATION + UNIT TEST
// this is beefier than need be, but integration tests for express are quick & small
// the entire "controller" is just our db for graphql, no need to test it again

describe('getRoutes', () => {
  const hashKey = 'threeve';

  it('GET /users/:id calls getItem on the dataSource with id', async () => {
    const auth = {
      id: '123',
      name: '456',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const getItem = jest.fn().mockResolvedValueOnce(auth);

    const usersDB = { getItem } as any;
    const request = getRestServer(usersDB);

    const response = await request.get(`/users/${auth.id}`).set('x-user-id', hashKey);

    expect(response.body).toEqual(auth);
    expect(getItem).toBeCalledWith(auth.id, { hashKey });
  });

  it('GET /users/ calls query on the dataSource with query', async () => {
    const auth = {
      id: '123',
      name: '456',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const query = jest.fn().mockResolvedValueOnce([auth]);

    const usersDB = { query } as any;
    const request = getRestServer(usersDB);

    const response = await request.get('/users?name=456');

    expect(response.body).toEqual([auth]);
    expect(query).toBeCalledWith({ name: '456' });
  });

  it('POST /users/ calls createItem on the dataSource with partial', async () => {
    const partialUser = {
      id: '123',
      name: '456',
    };
    const fullUser = {
      ...partialUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const createItem = jest.fn().mockResolvedValueOnce(fullUser);

    const usersDB = { createItem } as any;
    const request = getRestServer(usersDB);

    const response = await request
      .post('/users')
      .send(partialUser)
      .set('Content-Type', 'application/json')
      .set('x-user-id', hashKey);

    expect(response.body).toEqual(fullUser);
    expect(createItem).toBeCalledWith(partialUser, { hashKey });
  });

  it('PUT /users/:id calls updateItem on the dataSource with partial', async () => {
    const partialUser = {
      id: '123',
      name: '456',
    };
    const fullUser = {
      ...partialUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updateItem = jest.fn().mockResolvedValueOnce(fullUser);

    const usersDB = { updateItem } as any;
    const request = getRestServer(usersDB);

    const response = await request
      .put(`/users/${partialUser.id}`)
      .send(partialUser)
      .set('Content-Type', 'application/json')
      .set('x-user-id', hashKey);

    expect(response.body).toEqual(fullUser);
    expect(updateItem).toBeCalledWith(partialUser, { hashKey });
  });

  it('DELETE /users/:id calls deleteItem on the dataSource with id', async () => {
    const id = '123';

    const deleteItem = jest.fn().mockResolvedValueOnce(null);

    const usersDB = { deleteItem } as any;
    const request = getRestServer(usersDB);

    const response = await request.delete(`/users/${id}`, null).set('x-user-id', hashKey);

    expect(response.body).toEqual(null);
    expect(deleteItem).toBeCalledWith(id, { hashKey });
  });
});
