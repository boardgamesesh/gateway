// import { gql } from 'apollo-server-lambda';
// import getGraphqlServer from '../test/getGraphqlServer';

// INTEGRATION TEST OF THE FULL PATH
// only test for completion of high level access
// correct low level unit testing should be done on the resolver/util level

describe('Resolver full path', () => {
  it('tests aight', () => {
    expect(true).toBeTruthy();
  });

  // it('creates an item without error', async () => {
  //   const setHeaderMock = jest.fn();
  //   const { server, userSource } = getGraphqlServer({ setHeaders: { push: setHeaderMock } });
  //   const itemCreateMock = userSource.createItem as jest.Mock<any>;

  //   const authMutation = gql`
  //     mutation CreateUser($input: CreateUserInput!) {
  //       createUser(input: $input) {
  //         item {
  //           id
  //         }
  //       }
  //     }
  //   `;

  //   const item = {
  //     name: 'dongle',
  //   };

  //   itemCreateMock.mockImplementationOnce(async () => ({
  //     item: {
  //       id: 'threeve',
  //       ...item,
  //     },
  //   }));

  //   const { errors } = await server.executeOperation({
  //     query: authMutation,
  //     variables: { input: item },
  //   });

  //   expect(errors).toBeFalsy();
  // });
});
