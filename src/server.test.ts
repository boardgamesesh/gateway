import { gql } from 'apollo-server-lambda';
import getGraphqlServer from '../test/getGraphqlServer';

// INTEGRATION TEST OF THE FULL PATH
// more detailed tests exist in the resolvers file

describe('Resolver full path', () => {
  it('creates an item without error', async () => {
    const setHeaderMock = jest.fn();
    const { server, userSource } = getGraphqlServer({ setHeaders: { push: setHeaderMock } });
    const itemCreateMock = userSource.createItem as jest.Mock<any>;

    const authMutation = gql`
      mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          item {
            id
          }
        }
      }
    `;

    const item = {
      name: 'dongle',
    };

    itemCreateMock.mockImplementationOnce(async () => ({
      item: {
        id: 'threeve',
        ...item,
      },
    }));

    const { errors } = await server.executeOperation({
      query: authMutation,
      variables: { input: item },
    });

    expect(errors).toBeFalsy();
  });
});
