import { GraphQLDateTime, GraphQLJSONObject } from 'graphql-scalars';
import SESV2 from 'aws-sdk/clients/sesv2';
import { nanoid } from 'nanoid';
import { Context, IdObject, UserType, Affirmative } from './types';

export default () => ({
  Query: {
    user: async (_: any, args: { id: string }, { MagicUser }: Context) => {
      const { id } = args;
      // console.log('id', id);

      return MagicUser.get({ id });
    },
  },

  Mutation: {
    sendMagicLink: async (
      _: any,
      { email }: { email: string },
      { MagicUser }: Context
    ): Promise<Affirmative> => {
      const id = nanoid();
      const secretToken = nanoid();

      await MagicUser.create({ email, type: 'magic', id, secretToken });

      const sesClient = new SESV2({ region: 'ap-southeast-2' });

      await sesClient
        .sendEmail({
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
                  Data: `<h1>yo sign in idiot</h1><a href="https://localhost:9001/signup?token=${secretToken}">click here to sign in</a>`,
                  Charset: 'utf-8',
                },
              },
            },
          },
        })
        .promise();

      return { ok: true };
    },

    createMagicUser: async (
      _: any,
      { name, secretToken }: { name: string; secretToken: string },
      { id, MagicUser }: Context
    ): Promise<UserType> => {
      const foundUser = await MagicUser.get(id as string);

      if (secretToken !== foundUser.secretToken) {
        throw new Error('Unable to create user with invalid token');
      }

      return MagicUser.update({ id, name, secretToken: null });
    },

    updateUser: async (
      _: any,
      partialUser: Partial<UserType>,
      { id, MagicUser }: Context
    ): Promise<UserType | undefined> => {
      if (partialUser.email) {
        const [existingUser] = await MagicUser.scan({ email: partialUser.email }).exec();
        if (existingUser) throw new Error('unable to change email');
      }

      return MagicUser.update({ id, ...partialUser });
    },
  },

  User: {
    // for finding out the info of the other users in the system
    __resolveReference: async ({ id }: IdObject, { MagicUser }: Context) => {
      const foundUser = await MagicUser.get(id);
      return { name: foundUser.name, id: foundUser.id };
    },
  },

  DateTime: GraphQLDateTime,
  JSONObject: GraphQLJSONObject,
});
