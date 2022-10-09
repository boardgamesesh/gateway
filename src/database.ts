import dynamoose from 'dynamoose';
import { User } from './models';
import getEnv from './env';

export default () => {
  const db = new dynamoose.aws.ddb.DynamoDB({
    credentials: {
      secretAccessKey: getEnv().secretKey,
      accessKeyId: getEnv().accessKeyId,
    },
    region: getEnv().region,
  });

  dynamoose.aws.ddb.set(db);

  return new dynamoose.Table('Users', [User]);
};
