import { GraphQLDateTime, GraphQLJSONObject } from 'graphql-scalars';
import SESV2 from 'aws-sdk/clients/sesv2';
import { nanoid } from 'nanoid';
import { Context, IdObject, UserType, Affirmative } from './types';
import { createToken, createCookie } from './auth';

export default () => ({
  Query: {
    // notice the id isn't coming from params anymore
    // the auth context will deliver their user id
    user: async (_: any, _args: any, { MagicUser, id }: Context) => {
      if (!id) throw new Error('Unable to get, not signed in');

      return MagicUser.get({ id });
    },
  },

  Mutation: {
    sendMagicLink: async (
      _: any,
      { email }: { email: string },
      { MagicUser }: Context
    ): Promise<Affirmative> => {
      const secretToken = nanoid();

      let [user] = await MagicUser.query('email').eq(email).using('email').exec();

      if (!user) {
        user = await MagicUser.create({ email, type: 'magic', id: nanoid(), secretToken });
      } else {
        user = await MagicUser.update({ id: user.id, secretToken });
      }

      const sesClient = new SESV2({ region: 'ap-southeast-2' });

      await sesClient
        .sendEmail({
          FromEmailAddress: 'signin@boardgamesesh.com',
          Destination: {
            ToAddresses: [email],
          },
          Content: {
            Simple: {
              Subject: {
                Data: 'sign in to board game sesh!',
                Charset: 'utf-8',
              },
              Body: {
                Html: {
                  Data: `<h1>yo sign in idiot</h1><a href="https://boardgamesesh.com/signup?token=${secretToken}&id=${user.id}">click here to sign in</a>`,
                  Charset: 'utf-8',
                },
              },
            },
          },
        })
        .promise();

      return { ok: true };
    },

    // one of the few methods where id is sent in via mutation arguments
    signIn: async (
      _: any,
      { id, secretToken }: { id: string; secretToken: string },
      { MagicUser, setCookies, setHeaders }: Context
    ): Promise<UserType> => {
      const foundUser = await MagicUser.get(id as string);

      if (secretToken !== foundUser.secretToken) {
        throw new Error('Unable to sign in with invalid token');
      }

      const validToken = createToken({ email: foundUser.email, type: foundUser.type, id });
      setCookies.push(createCookie(validToken));
      setHeaders.push(validToken); // for frontend redirection help

      return MagicUser.update({ id, secretToken: null });
    },

    updateUser: async (
      _: any,
      { input: partialUser }: { input: Partial<UserType> },
      { id, email, MagicUser }: Context
    ): Promise<UserType | undefined> => {
      if (partialUser.email) {
        const [existingUser] = await MagicUser.scan({ email: partialUser.email }).exec();
        if (existingUser && partialUser.email !== email) throw new Error('unable to change email');
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
