import { Schema } from 'dynamoose';
import type { Item } from 'dynamoose/dist/Item';

export type InviteType = {
  createdAt: string;
  updatedAt: string;
  sessionId: string;
  userId: string;
  id: string;
};
export type InviteItem = Item & InviteType;

export default new Schema({
  sessionId: { type: String, index: { name: 'sessionId', type: 'global' } },
  userId: { type: String, index: { name: 'userId', type: 'global' } },
  id: { type: String, hashKey: true, required: true },
});
