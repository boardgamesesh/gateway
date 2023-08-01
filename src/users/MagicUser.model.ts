import { Schema } from 'dynamoose';
import type { Item } from 'dynamoose/dist/Item';

export type UserType = {
  secretToken?: string | null;
  createdAt: string;
  updatedAt: string;
  settings: any;
  email: string;
  name?: string;
  type: string; // magic | google | etc.
  pk: string;
};
export type UserItem = Item & UserType;

export default new Schema(
  {
    pk: { type: String, hashKey: true },
    sk: { type: String, rangeKey: true },
    GSI1PK: { type: String, index: { name: 'GSI1', rangeKey: 'GSI1SK', type: 'global' } },
    GSI1SK: { type: String },
  },
  {
    saveUnknown: true,
    timestamps: true,
  }
);
