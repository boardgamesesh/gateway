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

    const create = jest.fn();

    const { body } = (await server.executeOperation(
      {
        query: signUpMutation,
        variables: { email: 'bob@example.com' },
      },
      {
        contextValue: {
          setHeaders: { push: jest.fn() },
          setCookies: { push: jest.fn() },
          MagicUser: { create },
        },
      }
    )) as any;

    expect(body.singleResult.errors).toBeFalsy();
    expect(body.singleResult.data).toEqual({ sendMagicLink: { ok: true } });
    expect(create).toHaveBeenCalledWith({
      email: 'bob@example.com',
      type: 'magic',
      id: expect.any(String),
      secretToken: expect.any(String),
    });
  });
});
