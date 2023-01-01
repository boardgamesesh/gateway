import { gql } from 'graphql-tag';
import MockSES from 'aws-sdk/clients/ses';
import getGraphqlServer from '../test/getGraphqlServer';

jest.mock('aws-sdk/clients/sesv2', () => {
  const mSES = {
    sendEmail: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  return jest.fn(() => mSES);
});

// INTEGRATION TEST OF THE FULL PATH
// only test for completion of high level access
// correct low level unit testing should be done on the resolver/util level

describe('Resolver full path', () => {
  it('creates an item without error', async () => {
    const server = getGraphqlServer();
    new MockSES();

    const signUpMutation = gql`
      mutation SendMagicLink($email: String!) {
        sendMagicLink(email: $email) {
          ok
        }
      }
    `;

    const create = jest.fn().mockImplementationOnce(() => ({ id: '123' }));
    // TODO: simplify the nested dot call mocking with proxies or just a self referencing object
    const query = jest.fn().mockImplementation(() => ({
      eq: jest.fn().mockImplementation(() => ({
        using: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue([]),
        })),
      })),
    }));

    const { body } = (await server.executeOperation(
      {
        query: signUpMutation,
        variables: { email: 'bob@example.com' },
      },
      {
        contextValue: {
          MagicUser: { create, query } as any,
          event: {} as any,
          headers: {},
        },
      }
    )) as any;

    expect(body.singleResult.errors).toBeFalsy();
    expect(body.singleResult.data).toEqual({ sendMagicLink: { ok: true } });
    expect(query).toHaveBeenCalledWith('email');
    expect(create).toHaveBeenCalledWith({
      email: 'bob@example.com',
      type: 'magic',
      id: expect.any(String),
      secretToken: expect.any(String),
    });
  });

  it('also works with the handler to set headers properly', async () => {
    const server = getGraphqlServer();
    new MockSES();

    const signInMutation = gql`
      mutation SignIn($id: ID!, $secretToken: ID!) {
        signIn(id: $id, secretToken: $secretToken) {
          id
          email
        }
      }
    `;

    const get = jest.fn().mockImplementationOnce(() => ({ id: '123', secretToken: 'valid' }));
    const update = jest.fn().mockImplementationOnce(() => ({ id: '123', email: 'guy@fake.com' }));

    const headers = {} as any;

    const { body } = (await server.executeOperation(
      {
        query: signInMutation,
        variables: { id: '123', secretToken: 'valid' },
      },
      {
        contextValue: {
          MagicUser: { get, update } as any,
          event: {} as any,
          headers,
        },
      }
    )) as any;

    expect(body.singleResult.errors).toBeFalsy();
    expect(body.singleResult.data).toEqual({ signIn: { id: '123', email: 'guy@fake.com' } });
    expect(get).toHaveBeenCalledWith('123');
    expect(update).toHaveBeenCalledWith({ id: '123', secretToken: null });
    expect(headers.cookie).toEqual(expect.any(String));
  });
});
