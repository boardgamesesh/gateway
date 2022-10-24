export default () => ({
  region: process.env.REGION || 'ap-southeast-2',
  tableName: process.env.TABLE_NAME || 'ABJECT_FAILURE',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'NOT_THE_ID_AT_ALL',
  secretKey: process.env.AWS_SECRET_ACCESS_KEY || 'NOT_THE_KEY_LOL',
  jwtSecret: process.env.JWT_SECRET || 'not really a secret',
});
