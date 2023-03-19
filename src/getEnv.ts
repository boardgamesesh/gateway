export default () => ({
  region: process.env.REGION || 'ap-southeast-2',
  usersTableName: process.env.USERS_TABLE_NAME || 'USERS_FAILED',
  sessionsTableName: process.env.GAME_SESSIONS_TABLE_NAME || 'SESSIONS_FAILED',
  invitesTableName: process.env.INVITES_TABLE_NAME || 'INVITES_FAILED',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'NOT_THE_ID_AT_ALL',
  secretKey: process.env.AWS_SECRET_ACCESS_KEY || 'NOT_THE_KEY_LOL',
  jwtSecret: process.env.JWT_SECRET || 'not really a secret',
});
