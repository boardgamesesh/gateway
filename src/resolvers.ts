import { Condition } from 'dynamoose';
import { GraphQLDateTime, GraphQLJSONObject } from 'graphql-scalars';
import { SESV2 } from 'aws-sdk';
import { nanoid } from 'nanoid';
import { Context, IdObject, UserType, Affirmative } from './types';
import { User } from './models';

export const getResolvers = () => ({
  Query: {
    user: async (_: any, { id }: { id: string }, { dataSources }: Context) => {
      await dataSources.userSource.initialize();
      const foundUser = await User.get(id);
      return foundUser;
    },
  },

  Mutation: {
    sendMagicLink: async (_: any, { email }: { email: string }): Promise<Affirmative> => {
      const id = nanoid();

      await User.create(
        { email, type: 'magic', id, secretToken: nanoid() },
        { condition: new Condition('email not exists') } // TODO: make it real, idiot
      );

      const sesClient = new SESV2();

      await new Promise((resolve, reject) => {
        sesClient.sendEmail(
          {
            FromEmailAddress: 'signin@boarganise.com',
            Destination: {
              ToAddresses: [email],
            },
            Content: {
              Simple: {
                Subject: {
                  Data: 'sign in to boarganise!',
                  Charset: 'utf-8',
                },
                Body: {
                  Html: {
                    Data: `<h1>yo sign in idiot</h1><a href="">click here to sign in</a>`,
                    Charset: 'utf-8',
                  },
                },
              },
            },
          },
          (err, response) => {
            if (err) reject(err);
            resolve(response);
          }
        );
      });

      return { ok: true };
    },

    createMagicUser: async (
      _: any,
      { name, secretToken }: { name: string; secretToken: string },
      { id }: Context
    ): Promise<UserType> => {
      const foundUser = await User.get(id);
      if (secretToken !== foundUser.secretToken) {
        throw new Error('Unable to create user with invalid token');
      }

      const updatedUser = await User.update({ id, name, secretToken: null });

      // TODO: FIGURE OUT WHAT THE FUCK ON THIS TYPE SERIOUSLY DUDE
      return updatedUser as unknown as UserType;
    },

    updateUser: async (
      _: any,
      partialUser: Partial<UserType>,
      { id }: Context
    ): Promise<UserType> => {
      if (partialUser.email) {
        const [existingUser] = await User.scan({ email: partialUser.email }).exec();
        if (existingUser) throw new Error('unable to change email');
      }

      const updatedUser = await User.update({ id, ...partialUser });

      // TODO: FIGURE OUT WHAT THE FUCK ON THIS TYPE SERIOUSLY DUDE
      return updatedUser as unknown as UserType;
    },
  },

  User: {
    // for finding out the info of the other users in the system
    __resolveReference: async ({ id }: IdObject) => {
      const foundUser = await User.get(id);
      return { name: foundUser.name, id: foundUser.id };
    },
  },

  DateTime: GraphQLDateTime,
  JSONObject: GraphQLJSONObject,
});
