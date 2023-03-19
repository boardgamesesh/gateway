import { Schema, type } from 'dynamoose';
import type { Item } from 'dynamoose/dist/Item';

export type UserType = {
  secretToken?: string | null;
  createdAt: string;
  updatedAt: string;
  settings: any;
  email: string;
  name?: string;
  type: string; // magic | google | etc.
  id: string;
};
export type UserItem = Item & UserType;

export default new Schema(
  {
    id: { type: String, hashKey: true },
    name: { type: String },
    type: { type: String },
    location: { type: String },
    secretToken: { type: [String, type.NULL] },
    friendIds: { type: Array, schema: [String] },
    sessionIds: { type: Array, schema: [String] },
    settings: { type: Object, schema: { darkMode: Boolean } },
    email: { type: String, required: true, index: { name: 'email', type: 'global' } },
  },
  { saveUnknown: ['settings:**'], timestamps: true }
);
