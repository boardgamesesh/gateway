import SESV2 from 'aws-sdk/clients/sesv2';

export type SignInEmail = {
  email: string;
};
export const sendSignInEmail = async ({ email }: SignInEmail) => {
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
            Data: "You're invited to sign in to Board Game Sesh",
            Charset: 'utf-8',
          },
          Body: {
            Html: {
              Data: `
<h1>
  You're invited!
</h1>
<a href="https://boardgamesesh.com/login">
  click here to sign up/in!
</a>
`,
              Charset: 'utf-8',
            },
          },
        },
      },
    })
    .promise();
};
