import SESV2 from 'aws-sdk/clients/sesv2';

export type SignInEmail = {
  email: string;
  userId: string;
  secretToken: string;
};
export const sendSignInEmail = async ({ email, userId, secretToken }: SignInEmail) => {
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
              Data: `
<h1>
  yo sign in idiot
</h1>
<a href="https://boardgamesesh.com/login?token=${secretToken}&id=${userId}">
  click here to sign in
</a>

?token=${secretToken}&id=${userId}
`,
              Charset: 'utf-8',
            },
          },
        },
      },
    })
    .promise();
};
